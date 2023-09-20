import styles from './classic.module.scss';
import { classNames } from '@ember-decorators/component';
import Component from '@ember/component';

@classNames(styles.component)
export default class ComponentCssClassic extends Component {
  // ...
}
