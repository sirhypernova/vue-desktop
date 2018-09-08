import Vue from 'vue';
import Window from '@/components/Window';
import Taskbar from '@/components/Taskbar';
import HomeButton from '@/components/HomeButton';
import SettingsWindow from '@/components/windows/Settings';
import TaskbarItem from '@/components/TaskbarItem';
import * as VueWindow from '@hscmap/vue-window'
import Swatches from 'vue-swatches';

import "vue-swatches/dist/vue-swatches.min.css"

Vue.component('window',Window);
Vue.component('taskbar',Taskbar);
Vue.component('taskbaritem',TaskbarItem);
Vue.component('homebutton',HomeButton);
Vue.component('SettingsWindow',SettingsWindow);
Vue.component('swatches',Swatches);
Vue.use(VueWindow)