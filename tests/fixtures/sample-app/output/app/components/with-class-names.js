import { classNames } from '@ember-decorators/component';
import styles from './with-class-names.module.scss';
import Component from '@ember/component';

@classNames('whatever', styles.component)
export default class WithClassNames extends Component {
  // ...
}
