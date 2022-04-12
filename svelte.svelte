<!-- 1. class绑定 -->
<script>
    let done = true
</script>
<style>
    .done { 
        opacity: 0.4;
    }
</style>
<div class:done={done}></div>

<!-- 2.属性声明&组件事件 -->
export let value = '';
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();
dispatch('custom-event', xxxx);
父组件 handleEvent(e) { const data = e.detail }

<!-- 3.双向绑定 -->
bind:props={value}

<!-- 4.onMount 生命周期函数 -->
onMount(() => {
    let frame;
    (function loop({ 
        frame = requestAnimationFrame(loop);
    })()); 

    return () => { 
        cancelAnimationFrame(frame);
    }
});

<!-- 5.this绑定(引用)标签 -->
let canvas;
<canvas bind:this={canvas}></canvas>


// 6.生命周期 tick
<script>
    import { tick } from 'svelte';
	let text = `Select some text and hit the tab key to toggle uppercase`;

	async function handleKeydown(event) {
		if (event.which !== 9) return;

		event.preventDefault();

		const { selectionStart, selectionEnd, value } = this;
		const selection = value.slice(selectionStart, selectionEnd);

		const replacement = /[a-z]/.test(selection)
			? selection.toUpperCase()
			: selection.toLowerCase();

		text = (
			value.slice(0, selectionStart) +
			replacement +
			value.slice(selectionEnd)
		);

		// this has no effect, because the DOM hasn't updated yet
        await tick();
		this.selectionStart = selectionStart;
		this.selectionEnd = selectionEnd;
	}
</script>

<style>
	textarea {
		width: 100%;
		height: 200px;
	}
</style>

<textarea value={text} on:keydown={handleKeydown}></textarea>