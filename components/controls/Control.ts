import { Vue, Component, Lifecycle, Prop } from 'av-ts'

import * as AmountField from './AmountField.vue'
import * as AmountLabel from './AmountLabel.vue'
import * as AttachmentField from './AttachmentField.vue'
import * as AudioField from './AudioField.vue'
import * as BigDecimalInputField from './BigDecimalInputField.vue'
import * as BigDecimalPercentagField from './BigDecimalPercentagField.vue'
import * as CheckBoxField from './CheckBoxField.vue'
import * as CustomComboBox from './CustomComboBox.vue'
import * as DateField from './DateField.vue'
import * as DateLabelField from './DateLabelField.vue'
import * as DateTimeField from './DateTimeField.vue'
import * as DoubleField from './DoubleField.vue'
import * as EmailField from './EmailField.vue'
import * as ImageField from './ImageField.vue'
import * as IntegerField from './IntegerField.vue'
import * as IPAddressField from './IPAddressField.vue'
import * as LabelField from './LabelField.vue'
import * as LongField from './LongField.vue'
import * as PasswordField from './PasswordField.vue'
import * as PercentageField from './PercentageField.vue'
import * as PercentageLabel from './PercentageLabel.vue'
import * as PhoneField from './PhoneField.vue'
import * as RichTextField from './RichTextField.vue'
import * as RichTextReadOnlyField from './RichTextReadOnlyField.vue'
import * as TextAreaField from './TextAreaField.vue'
import * as TextField from './TextField.vue'
import * as TimeField from './TimeField.vue'
import * as UrlField from './UrlField.vue'
import * as VideoField from './VideoField.vue'
import * as LinkField from './LinkField.vue'

import * as DateRangeField from './DateRangeField.vue'
import * as EditAndViewTableColumn from './EditAndViewTableColumn.vue'
import * as BooleanReadOnlyField from './BooleanReadOnlyField.vue'

import * as UnknownField from './UnknownField.vue'


@Component({
    components: {
        AmountLabel, AmountField, AttachmentField, AudioField, BigDecimalInputField,
        BigDecimalPercentagField, CheckBoxField, CustomComboBox, DateField, DateLabelField, DateTimeField,
        DoubleField, EmailField, ImageField, IntegerField, IPAddressField, LabelField,
        LongField, PasswordField, PercentageField, PercentageLabel, PhoneField, RichTextField,
        RichTextReadOnlyField, TextAreaField, TextField, TimeField, UrlField, VideoField,
        EditAndViewTableColumn, BooleanReadOnlyField, DateRangeField, LinkField,
        UnknownField
    }
})
export default class Control extends Vue {

    @Prop
    comp:string;
    
    @Prop
    value: any;

    @Prop
    property: string;

    @Prop
    value1Prop:string

    @Prop
    disableProp: string

    @Prop
    value2: any;

    onPropertyChange(val: any) {
        this.value[this.property] = val;        
        this.$emit('propertyChange', this.property);        
    }
}