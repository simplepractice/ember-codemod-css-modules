import styles from './template-only.module.scss';
import { classNames } from '@ember-decorators/component';
import Component from '@ember/component';

@classNames(styles.component)
export default class TemplateOnly extends Component {}
