import { Vue, Component, Prop, Lifecycle } from 'av-ts'

@Component()
export default class unknownview extends Vue {

    @Prop
    input: any;

    @Lifecycle
    mounted() {
        this.$emit('title', 'Not Found')
    }
}