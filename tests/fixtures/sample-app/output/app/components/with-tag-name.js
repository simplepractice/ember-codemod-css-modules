import { tagName, classNames } from '@ember-decorators/component';
import classic from 'ember-classic-decorator';
import styles from './with-tag-name.module.scss';
import Component from '@ember/component';

// test
@classic
@tagName('span')
@classNames(styles.component)
export default class WithTagName extends Component {}
