import spotipy
from spotipy.exceptions import SpotifyException
import random

class SpotifyClient:
    def __init__(self, sp):
        self.sp = sp
        # Hardcoded safe genres to avoid slow API call on startup
        self.valid_genres = {
            'acoustic', 'afrobeat', 'alt-rock', 'alternative', 'ambient', 'anime', 
            'black-metal', 'bluegrass', 'blues', 'bossanova', 'brazil', 'breakbeat', 
            'british', 'cantopop', 'chicago-house', 'children', 'chill', 'classical', 
            'club', 'comedy', 'country', 'dance', 'dancehall', 'death-metal', 
            'deep-house', 'detroit-techno', 'disco', 'disney', 'drum-and-bass', 'dub', 
            'dubstep', 'edm', 'electro', 'electronic', 'emo', 'folk', 'forro', 'french', 
            'funk', 'garage', 'german', 'gospel', 'goth', 'grindcore', 'groove', 
            'grunge', 'guitar', 'happy', 'hard-rock', 'hardcore', 'hardstyle', 
            'heavy-metal', 'hip-hop', 'holidays', 'honky-tonk', 'house', 'idm', 
            'indian', 'indie', 'indie-pop', 'industrial', 'iranian', 'j-dance', 'j-idol', 
            'j-pop', 'j-rock', 'jazz', 'k-pop', 'kids', 'latin', 'latino', 'malay', 
            'mandopop', 'metal', 'metal-misc', 'metalcore', 'minimal-techno', 'movies', 
            'mpb', 'new-age', 'new-release', 'opera', 'pagode', 'party', 'philippines-opm', 
            'piano', 'pop', 'pop-film', 'post-dubstep', 'power-pop', 'progressive-house', 
            'psych-rock', 'punk', 'punk-rock', 'r-n-b', 'rainy-day', 'reggae', 'reggaeton', 
            'road-trip', 'rock', 'rock-n-roll', 'rockabilly', 'romance', 'sad', 'salsa', 
            'samba', 'sertanejo', 'show-tunes', 'singer-songwriter', 'ska', 'sleep', 
            'songwriter', 'soul', 'soundtracks', 'spanish', 'study', 'summer', 'swedish', 
            'synth-pop', 'tango', 'techno', 'trance', 'trip-hop', 'turkish', 'work-out', 
            'world-music'
        }

    def get_user_profile(self):
        return self.sp.current_user()

    def get_liked_tracks(self, limit=20):
        try:
            results = self.sp.current_user_saved_tracks(limit=limit)
            return [self._format_track(item['track']) for item in results['items']]
        except Exception:
            return []

    def get_user_playlists(self):
        try:
            results = self.sp.current_user_playlists(limit=20)
            return [{'id': i['id'], 'name': i['name']} for i in results['items']]
        except Exception:
            return []

    def get_top_genres(self, limit=10):
        try:
            results = self.sp.current_user_top_artists(limit=20, time_range='medium_term')
            genres = {}
            for artist in results['items']:
                for genre in artist['genres']:
                    genres[genre] = genres.get(genre, 0) + 1
            return sorted(genres.items(), key=lambda x: x[1], reverse=True)[:limit]
        except Exception:
            return []

    def get_top_artists(self, limit=10):
        try:
            results = self.sp.current_user_top_artists(limit=limit, time_range='medium_term')
            return [{'name': i['name'], 'image_url': i['images'][0]['url'] if i['images'] else None, 'external_url': i['external_urls']['spotify']} for i in results['items']]
        except Exception:
            return []

    def get_top_tracks(self, limit=10):
        try:
            results = self.sp.current_user_top_tracks(limit=limit, time_range='medium_term')
            return [self._format_track(item) for item in results['items']]
        except Exception:
            return []

    def get_new_releases(self, limit=10):
        try:
            results = self.sp.new_releases(limit=limit, country='US')
            # New releases are albums, so we need to format differently or pick first track? 
            # Actually, standard format requires 'track' structure. 
            # API returns albums. Let's return simplified album objects or adapt.
            # To keep it simple and compatible with simple image/text display, I'll return a custom object list
            # but ideally I should adhere to _format_track if possible.
            # However, albums don't have 'preview_url' in the same way. 
            # Let's return a list of dicts similar to artists but for albums.
            return [{
                'name': i['name'], 
                'artists': [a['name'] for a in i['artists']],
                'image_url': i['images'][0]['url'] if i['images'] else None, 
                'external_url': i['external_urls']['spotify'],
                'release_date': i['release_date']
            } for i in results['albums']['items']]
        except Exception:
            return []

    def get_recommendations(self, seed_tracks=None, seed_genres=None, seed_artists=None, limit=10, **kwargs):
        """
        Robust recommendation fetcher. Tries standard API, falls back to Search/TopTracks.
        """
        seeds = {}
        if seed_tracks: seeds['seed_tracks'] = seed_tracks[:5]
        elif seed_genres: seeds['seed_genres'] = seed_genres[:5]
        elif seed_artists: seeds['seed_artists'] = seed_artists[:5]
        else: seeds['seed_genres'] = ['pop']

        # Attempt 1: Standard API (might 404)
        try:
            results = self.sp.recommendations(limit=limit, **seeds, **kwargs)
            if results['tracks']: return [self._format_track(t) for t in results['tracks']]
        except Exception as e:
            print(f"Standard Rec API failed: {e}")

        # Attempt 2: Search-Based Fallback (The "Manual" Way)
        print("Switching to Search-Based Recommendation Engine...")
        return self._recommend_via_search(seed_genres, seed_artists, seed_tracks, limit)

    def _recommend_via_search(self, genres, artists, tracks, limit):
        """
        Manually constructs a playlist using Search and Artist Top Tracks.
        """
        recs = []
        try:
            # Strategy A: Genre Search
            if genres:
                for g in genres:
                    # Search for tracks in this genre with a random offset for variety
                    offset = random.randint(0, 50)
                    q = f"genre:{g}"
                    results = self.sp.search(q=q, type='track', limit=20, offset=offset)
                    for t in results['tracks']['items']:
                        recs.append(self._format_track(t))
            
            # Strategy B: Artist Top Tracks (ID or Name)
            if artists:
                for a_seed in artists:
                    try:
                        # Check if it's a name-based seed (from Sonic Multiverse)
                        if a_seed.startswith("name:"):
                            artist_name = a_seed.replace("name:", "")
                            print(f"Searching for artist: {artist_name}")
                            
                            # Try 1: Specific Artist Search
                            q = f"artist:{artist_name}"
                            results = self.sp.search(q=q, type='track', limit=10)
                            if results['tracks']['items']:
                                for t in results['tracks']['items']:
                                    recs.append(self._format_track(t))
                            else:
                                # Try 2: General Search (Brute Force)
                                print(f"Specific search failed, trying general: {artist_name}")
                                results = self.sp.search(q=artist_name, type='track', limit=10)
                                for t in results['tracks']['items']:
                                    recs.append(self._format_track(t))

                        else:
                            # It's an ID (standard fallback)
                            top = self.sp.artist_top_tracks(a_seed, country='US')
                            if top['tracks']:
                                for t in top['tracks']:
                                    recs.append(self._format_track(t))
                            else:
                                # Fallback: Search by Name if ID fails
                                artist_info = self.sp.artist(a_seed)
                                q = f"artist:{artist_info['name']}"
                                results = self.sp.search(q=q, type='track', limit=10)
                                for t in results['tracks']['items']:
                                    recs.append(self._format_track(t))
                    except Exception as e:
                        print(f"Artist search error for {a_seed}: {e}")
                        pass

            # Strategy C: Tracks -> Artists -> Top Tracks
            if tracks:
                # Fetch full track info to get artist IDs
                try:
                    full_tracks = self.sp.tracks(tracks[:5])
                    artist_ids = set()
                    for t in full_tracks['tracks']:
                        if t and t['artists']:
                            artist_ids.add(t['artists'][0]['id'])
                    
                    for a_id in list(artist_ids)[:3]:
                        try:
                            top = self.sp.artist_top_tracks(a_id, country='US')
                            for t in top['tracks']:
                                recs.append(self._format_track(t))
                        except:
                            pass
                except:
                    pass

            # If still empty, Ultimate Fallback: Search "Pop"
            if not recs:
                results = self.sp.search(q="genre:pop", type='track', limit=20)
                for t in results['tracks']['items']:
                    recs.append(self._format_track(t))

            # Shuffle and return unique tracks
            random.shuffle(recs)
            # Deduplicate by ID
            unique_recs = []
            seen_ids = set()
            for r in recs:
                if r['id'] not in seen_ids:
                    unique_recs.append(r)
                    seen_ids.add(r['id'])
            
            return unique_recs[:limit]

        except Exception as e:
            print(f"Search Fallback failed: {e}")
            return []

    def search_decade(self, start_year, end_year, limit=10):
        query = f"year:{start_year}-{end_year}"
        try:
            results = self.sp.search(q=query, type='track', limit=limit)
            return [self._format_track(t) for t in results['tracks']['items']]
        except Exception:
            return []

    def get_mixed_seeds(self, max_seeds=5):
        """
        Creates a diverse mix of seeds from multiple sources:
        1. Top tracks (from listening history) - most reliable
        2. Top artists 
        3. Liked tracks (fallback)
        Returns dict with seed_tracks and seed_artists lists.
        """
        seed_tracks = []
        seed_artists = []
        
        # Priority 1: Top tracks (these represent actual listening behavior)
        try:
            top_tracks = self.sp.current_user_top_tracks(limit=20, time_range='medium_term')
            seed_tracks.extend([t['id'] for t in top_tracks['items'][:10]])
        except Exception as e:
            print(f"Failed to get top tracks: {e}")
        
        # Priority 2: Top artists
        try:
            top_artists = self.sp.current_user_top_artists(limit=10, time_range='medium_term')
            seed_artists.extend([a['id'] for a in top_artists['items'][:5]])
        except Exception as e:
            print(f"Failed to get top artists: {e}")
        
        # Priority 3: Liked tracks (if we still need more seeds)
        if len(seed_tracks) < 5:
            try:
                liked = self.sp.current_user_saved_tracks(limit=20)
                liked_ids = [item['track']['id'] for item in liked['items'] if item['track']]
                # Add liked tracks that aren't already in seed_tracks
                for tid in liked_ids:
                    if tid not in seed_tracks:
                        seed_tracks.append(tid)
                        if len(seed_tracks) >= 10:
                            break
            except Exception as e:
                print(f"Failed to get liked tracks: {e}")
        
        # Spotify API allows max 5 seeds total (tracks + artists + genres combined)
        # Prioritize tracks, then fill with artists
        final_tracks = seed_tracks[:4]  # Leave room for at least 1 artist
        remaining_slots = max_seeds - len(final_tracks)
        final_artists = seed_artists[:remaining_slots] if remaining_slots > 0 else []
        
        return {
            'seed_tracks': final_tracks if final_tracks else None,
            'seed_artists': final_artists if final_artists else None,
            'total_sources': len(seed_tracks) + len(seed_artists)
        }

    def get_audio_profile(self):
        """
        Analyzes user's top tracks to create an audio profile.
        Returns average values for energy, danceability, valence, etc.
        """
        try:
            # Get top tracks
            top_tracks = self.sp.current_user_top_tracks(limit=50, time_range='medium_term')
            track_ids = [t['id'] for t in top_tracks['items']]
            
            if not track_ids:
                return None
            
            # Get audio features for these tracks
            features = self.sp.audio_features(track_ids)
            
            # Calculate averages
            valid_features = [f for f in features if f is not None]
            if not valid_features:
                return None
            
            avg_energy = sum(f['energy'] for f in valid_features) / len(valid_features)
            avg_danceability = sum(f['danceability'] for f in valid_features) / len(valid_features)
            avg_valence = sum(f['valence'] for f in valid_features) / len(valid_features)
            avg_acousticness = sum(f['acousticness'] for f in valid_features) / len(valid_features)
            avg_instrumentalness = sum(f['instrumentalness'] for f in valid_features) / len(valid_features)
            avg_tempo = sum(f['tempo'] for f in valid_features) / len(valid_features)
            
            return {
                'energy': round(avg_energy * 100),
                'danceability': round(avg_danceability * 100),
                'valence': round(avg_valence * 100),  # Happiness
                'acousticness': round(avg_acousticness * 100),
                'instrumentalness': round(avg_instrumentalness * 100),
                'tempo': round(avg_tempo),
                'tracks_analyzed': len(valid_features)
            }
        except Exception as e:
            print(f"Failed to get audio profile: {e}")
            return None

    def get_listening_stats(self):
        """
        Returns comprehensive listening statistics.
        """
        stats = {
            'total_top_tracks': 0,
            'total_top_artists': 0,
            'total_genres': 0,
            'total_liked_tracks': 0,
            'top_track': None,
            'top_artist': None,
            'unique_genres': []
        }
        
        try:
            # Top tracks count
            top_tracks = self.sp.current_user_top_tracks(limit=50, time_range='long_term')
            stats['total_top_tracks'] = len(top_tracks['items'])
            if top_tracks['items']:
                t = top_tracks['items'][0]
                stats['top_track'] = {
                    'name': t['name'],
                    'artist': t['artists'][0]['name'] if t['artists'] else 'Unknown',
                    'image_url': t['album']['images'][0]['url'] if t['album']['images'] else None,
                    'external_url': t['external_urls']['spotify']
                }
        except Exception as e:
            print(f"Failed to get top tracks stats: {e}")
        
        try:
            # Top artists count and genres
            top_artists = self.sp.current_user_top_artists(limit=50, time_range='long_term')
            stats['total_top_artists'] = len(top_artists['items'])
            
            # Collect all genres
            all_genres = set()
            for artist in top_artists['items']:
                all_genres.update(artist['genres'])
            
            stats['unique_genres'] = list(all_genres)[:20]  # Top 20 genres
            stats['total_genres'] = len(all_genres)
            
            if top_artists['items']:
                a = top_artists['items'][0]
                stats['top_artist'] = {
                    'name': a['name'],
                    'image_url': a['images'][0]['url'] if a['images'] else None,
                    'external_url': a['external_urls']['spotify'],
                    'genres': a['genres'][:3]  # Top 3 genres for this artist
                }
        except Exception as e:
            print(f"Failed to get top artists stats: {e}")
        
        try:
            # Liked tracks count (approximate)
            liked = self.sp.current_user_saved_tracks(limit=1)
            stats['total_liked_tracks'] = liked.get('total', 0)
        except Exception:
            pass
        
        return stats

    def _format_track(self, track):
        return {
            'id': track['id'],
            'name': track['name'],
            'artists': [a['name'] for a in track['artists']],
            'preview_url': track['preview_url'],
            'external_url': track['external_urls']['spotify'],
            'image_url': track['album']['images'][0]['url'] if track['album']['images'] else None,
            'uri': track['uri']
        }

