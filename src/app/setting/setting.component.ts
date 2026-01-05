import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UpdateCurrentUserBodyRequest } from '../shared/services';
import { AuthStore } from '../shared/store';
import { TypedFormGroup } from '../shared/utils';

@Component({
  selector: 'app-setting',
  imports: [ReactiveFormsModule],
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class SettingComponent implements OnInit {
  // ---------------- Formulaire utilisateur ----------------
  readonly #authStore = inject(AuthStore);
  readonly settingForm: TypedFormGroup<UpdateCurrentUserBodyRequest> =
    new FormGroup({
      bio: new FormControl('', { nonNullable: true }),
      email: new FormControl('', { nonNullable: true }),
      password: new FormControl('', { nonNullable: true }),
      username: new FormControl('', { nonNullable: true }),
      image: new FormControl('', { nonNullable: true }),
    });

  // ---------------- Carrousel de vidéos ----------------
  readonly videos = [
    'assets/videos/video1.mp4',
    'assets/videos/video2.mp4',
    'assets/videos/video3.mp4'
  ];
  currentVideoIndex = 0;
  currentVideo = this.videos[this.currentVideoIndex];

  constructor() {
    // Patch automatique du formulaire si l'utilisateur existe
    effect(() => {
      const user = this.#authStore.selectors.user();
      if (user) {
        this.settingForm.patchValue(user);
      }
    });
  }

  ngOnInit(): void {
    // Charger les infos utilisateur
    this.#authStore.getCurrentUser();

    // Initialiser le carrousel automatique toutes les 5 secondes
    setInterval(() => {
      this.currentVideoIndex = (this.currentVideoIndex + 1) % this.videos.length;
      this.currentVideo = this.videos[this.currentVideoIndex];
    }, 5000);
  }

  // ---------------- Formulaire ----------------
  submit(): void {
    this.#authStore.updateCurrentUser(this.settingForm);
  }

  logout(): void {
    this.#authStore.logout();
  }

  // ---------------- Contrôle manuel du carrousel ----------------
  nextVideo(): void {
    this.currentVideoIndex = (this.currentVideoIndex + 1) % this.videos.length;
    this.currentVideo = this.videos[this.currentVideoIndex];
  }

  prevVideo(): void {
    this.currentVideoIndex =
      (this.currentVideoIndex - 1 + this.videos.length) % this.videos.length;
    this.currentVideo = this.videos[this.currentVideoIndex];
  }
}
