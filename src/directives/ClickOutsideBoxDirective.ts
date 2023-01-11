export default (app) => {
    app.directive('click-outside-box', {
        // called before bound element's attributes
        // or event listeners are applied
        // => created(el, binding, vnode, prevVnode) {},
        // called right before the element is inserted into the DOM.
        // => beforeMount(el, binding, vnode, prevVnode) {},
        // called when the bound element's parent component
        // and all its children are mounted.
        mounted(el, binding) {
            el.clickOutsideEvent = function(event) {
                if (!(el == event.target || el.contains(event.target))) {
                    binding.value(event, el)
                }
            }
            document.addEventListener("click", el.clickOutsideEvent)
        },
        // called before the parent component is updated
        // => beforeUpdate(el, binding, vnode, prevVnode) {},
        // called after the parent component and
        // all of its children have updated
        // => updated(el, binding, vnode, prevVnode) {},
        // called before the parent component is unmounted
        // => beforeUnmount(el, binding, vnode, prevVnode) {},
        // called when the parent component is unmounted
        unmounted(el) {
            document.removeEventListener("click", el.clickOutsideEvent)
        }
    })
}