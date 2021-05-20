export default {
  methods: {
    mixBindingEvent(target) {
      Object.keys(this.$listeners).forEach((eventName) => {
        target.on(eventName, (...rest) => {
          this.$emit(eventName, ...rest);
        });
      });
    }
  }
}