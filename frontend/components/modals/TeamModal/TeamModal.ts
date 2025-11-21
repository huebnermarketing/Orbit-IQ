import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'TeamModal',
  props: {
    team: {
      type: Object as () => any,
      required: false,
    },
    isEdit: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ['close', 'success'],

  setup(props, { emit }) {
    return {
      isEdit: computed(() => props.isEdit),
    };
  },
});

