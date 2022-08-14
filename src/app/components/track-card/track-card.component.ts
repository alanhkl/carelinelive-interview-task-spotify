import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SimpleTrack } from '@app/services/spotify/models/simple-playlist';

@Component({
    selector: 'app-track-card',
    templateUrl: './track-card.component.html',
    styleUrls: ['./track-card.component.scss']
})
export class TrackCardComponent implements OnInit, OnChanges {
    @Input() track!: SimpleTrack;
    @Input() index!: number;
    @Input() color: string = "#333";
    public pRate: string = "🔥";
    public orderNum?: number;
    ngOnInit(): void {
        this.orderNum = this.index + 1;
    }

    ngOnChanges(): void {
        this.orderNum = this.index + 1;
        this.setPopular();
    }

    setPopular() {
        const full = Array(10).fill("🔥");
        const rate = Math.ceil(this.track.popularity / 20);
        this.pRate = full.slice(0, rate).join('');
    }
}
