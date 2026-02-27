<script lang="tsx">
import emptyImage from '@/assets/imgs/empty/empty1.png'
export default defineComponent({
  name: 'Empty',
  setup() {
    return () => (
      <div class="flex flex-col items-center justify-center mt-100px mb-100px s-empty">
        <img class="h-188px mb-8" src={emptyImage} alt="empty" />
        <span class="text-#909399 text-14px">暂无数据</span>
      </div>
    )
  }
})
</script>
