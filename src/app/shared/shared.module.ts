import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SocialLinkContainerComponent} from './components/social-container/social-container.component';
import { CtaOneComponent } from './components/rippler-cta-one/cta-one.component';
import {CtaThreeComponent} from './components/rippler-cta-three/cta-three.component';
import {GravidaoLogoComponent} from './components/gravidao-logo/gravidao-logo.component';
import {HeaderComponent} from './components/rippler-header/header-component';
import {SearchComponent} from './components/rippler-search-component/search.component';
import {ImgFallbackDirective} from './_helpers/image-fallback-directive';

const commonModules = [
  CtaOneComponent,
  CtaThreeComponent,
  SocialLinkContainerComponent,
  GravidaoLogoComponent,
  HeaderComponent,
  SearchComponent,
  ImgFallbackDirective
];

@NgModule({
  declarations: commonModules,
  exports: commonModules,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {

}
