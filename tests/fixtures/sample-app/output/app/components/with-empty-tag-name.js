import { tagName, classNames } from '@ember-decorators/component';
import styles from './with-empty-tag-name.module.scss';
import Component from '@ember/component';

@tagName('')
@classNames(styles.component)
export default class WithEmptyTagName extends Component {
  styles = styles;
}
