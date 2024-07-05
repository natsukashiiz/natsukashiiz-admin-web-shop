import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSettingStore = defineStore('setting', () => {
  const sidebarCollapsed = ref(false)

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
    localStorage.setItem('sidebar-collapsed', String(sidebarCollapsed.value))
  }

  const loadSetting = () => {
    // load setting from localStorage
    const collapsed = localStorage.getItem('sidebar-collapsed')
    if (collapsed) {
      sidebarCollapsed.value = collapsed === 'true'
    }
  }

  return { sidebarCollapsed, toggleSidebar, loadSetting }
})
