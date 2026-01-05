import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import { DEFAULT_LIMIT } from '../shared/constants';
import { AuthStore } from '../shared/store';
import { ArticleListComponent } from '../shared/ui/article-list';
import { PaginationComponent } from '../shared/ui/pagination';
import { FEED_TYPE, FeedType, HomeStore } from './home.store';
import { FeedToggleComponent } from './ui/feed-toggle/feed-toggle.component';
import { TagsComponent } from './ui/tags/tags.component';
import { Article } from '../shared/models';

@Component({
  selector: 'app-home',
  imports: [
    TagsComponent,
    FeedToggleComponent,
    NgIf,
    ArticleListComponent,
    PaginationComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentStore(HomeStore)]
})
export default class HomeComponent implements OnInit, OnDestroy {
  readonly #homeStore = inject(HomeStore);
  readonly #authStore = inject(AuthStore);
  readonly #cdr = inject(ChangeDetectorRef);

  readonly articleCount = this.#homeStore.selectors.articleCount;
  readonly currentOffset = this.#homeStore.selectors.currentOffset;
  readonly isAuthenticated = this.#authStore.selectors.isAuthenticated;
  readonly articleList = this.#homeStore.selectors.articleList;

  // ✅ AJOUT — ROTATOR anti-eco
  readonly heavyImages: string[] = Array.from({ length: 10 }, (_, i) => {
    const n = String(i + 1).padStart(2, '0');
    return `assets/rotator/heavy-${n}.jpg`;
  });
  currentImageIndex = 0;
  currentImageSrc = this.heavyImages[0];
  rotationCount = 0;
  isRotatorLoading = true;
  private rotatorTimer?: number;

  ngOnInit(): void {
    if (this.isAuthenticated()) {
      this.toggleFeed(FEED_TYPE.yourFeed);
    } else {
      this.toggleFeed(FEED_TYPE.globalFeed);
    }

    // ✅ AJOUT — rotation toutes les 3 secondes
    this.rotatorTimer = window.setInterval(() => {
      this.rotationCount++;
      this.isRotatorLoading = true;
      this.currentImageIndex = (this.currentImageIndex + 1) % this.heavyImages.length;
      this.currentImageSrc = this.heavyImages[this.currentImageIndex];

      // ✅ AJOUT — force le refresh avec OnPush
      this.#cdr.markForCheck();
    }, 3000);
  }

  // ✅ AJOUT
  ngOnDestroy(): void {
    if (this.rotatorTimer) window.clearInterval(this.rotatorTimer);
  }

  // ✅ AJOUT
  onRotatorImageLoaded(): void {
    this.isRotatorLoading = false;

    // ✅ AJOUT — force le refresh avec OnPush
    this.#cdr.markForCheck();
  }

  selectTag(tag: string): void {
    this.#homeStore.queryArticle({
      feedType: FEED_TYPE.tagFeed,
      params: {
        limit: DEFAULT_LIMIT,
        offset: 0,
        tag,
      },
    });
  }

  toggleFeed(feedType: FeedType): void {
    this.#homeStore.queryArticle({
      feedType,
      params: {
        limit: DEFAULT_LIMIT,
        offset: 0,
      },
    });
  }

  onPageOffsetChange(offset: number): void {
    this.#homeStore.onOffsetChange(offset);
  }

  toggleFavorite(article: Article): void {
    this.#homeStore.toggleFavorite(article);
  }
}
