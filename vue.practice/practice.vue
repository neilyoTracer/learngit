<script setup>
import { onMounted } from ' vue'
import { inject } from 'vue'

const i18n = inject('i18n')
console.log(i18n.greetings.hello)

onMounted(() => { 
    console.log('....')
})
</script>