import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RandomImageService } from 'src/app/shared/services/image.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  constructor(public randomImageService: RandomImageService) {}
}
