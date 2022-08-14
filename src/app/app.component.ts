import { Component } from '@angular/core';
import { switchMap, tap } from 'rxjs';
import { PlaylistSearchResult, SpotifyApiService } from '@app/services/spotify/spotify-api.service';
import { SimpleTrack } from './services/spotify/models/simple-playlist';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    public token$ = this.spotify.getToken();

    public selectedMusicId: string = '';

    // https://open.spotify.com/playlist/0UA4PppdcKIKojVy5iSVoD
    playlist$ = this.token$.pipe(
        switchMap(token => this.spotify.playlist('0UA4PppdcKIKojVy5iSVoD', token))
    );

    constructor(
        private spotify: SpotifyApiService,
    ) { }

    public onSelectPlaylist(playlist: PlaylistSearchResult) {
        this.playlist$ = this.token$.pipe(
            switchMap(token => this.spotify.playlist(playlist.id, token))
        );
    }

    public onSelectTrack(track: SimpleTrack) {
        this.selectedMusicId = !!track ? track.id : '';
    }
}
