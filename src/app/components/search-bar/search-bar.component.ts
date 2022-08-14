import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { switchMap } from 'rxjs';
import { PlaylistSearchResult, SpotifyApiService } from '@app/services/spotify/spotify-api.service';



@Component({
    selector: 'search-bar',
    templateUrl: 'search-bar.component.html',
    styleUrls: ['search-bar.component.scss']
})

export class SearchBarComponent implements OnInit {

    public myControl = new FormControl('');
    public options: PlaylistSearchResult[] = [];
    public filteredOptions$?: Observable<PlaylistSearchResult[]>;
    private search$?: Observable<PlaylistSearchResult[]>;

    @Input() token$!: Observable<string>;
    @Output() selectPlaylist = new EventEmitter<PlaylistSearchResult>();
    constructor(private spotify: SpotifyApiService,) { }


    ngOnInit() {
        this.search$ = this.token$.pipe(
            switchMap(token => this.spotify.searchPlaylists('test', token))
        );

        this.initSearch();
    }

    private initSearch(): void {
        this.filteredOptions$ = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => {
                if (value.length < 2) { return [] }
                const name: string = typeof value === 'string' ? value : value?.name;
                this.search$ = this.getSearchObs(name.trim());
                this.search$.subscribe((playlists) => { this.options = playlists });
                return name ? this._filter(name as string) : this.options.slice();
            }),
        );
    }


    private getSearchObs(albumName: string) {
        return this.token$.pipe(
            switchMap(token => this.spotify.searchPlaylists(albumName, token))
        );
    }

    private _filter(name: string): PlaylistSearchResult[] {
        const filterValue = name.toLowerCase();

        return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
    }
    public displayFn(playlist: PlaylistSearchResult): string {
        return playlist && playlist.name ? playlist.name : '';
    }

    public onSelectPlaylist(playlist: PlaylistSearchResult) {
        this.selectPlaylist.emit(playlist)
    }
}