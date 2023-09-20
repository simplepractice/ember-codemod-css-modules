import { tagName } from '@ember-decorators/component';
import classic from 'ember-classic-decorator';
import Component from '@ember/component';

// test
@classic
@tagName('span')
export default class WithTagName extends Component {}
