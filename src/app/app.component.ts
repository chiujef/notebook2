import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'Notebook App';
  height: number;

  constructor(private cdRef: ChangeDetectorRef) { }

  ngAfterViewInit() {
    // TODO: Update this. Recompute seems to have an issue
    // TODO: ensure window is injected
    this.height = this.computeHeight(window.innerHeight);
    this.cdRef.detectChanges();
  }

  onResize(event) {
    // to setup the scrollbar needed
    this.height = this.computeHeight(event.target.innerHeight);
  }

  computeHeight(height: number): number {
    return height - 150;
  }
}
