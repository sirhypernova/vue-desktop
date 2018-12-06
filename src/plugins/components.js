import Vue from 'vue';
import Window from '@/components/Window';
import Taskbar from '@/components/Taskbar';
import HomeButton from '@/components/HomeButton';
import SettingsWindow from '@/components/windows/Settings';
import TerminalWindow from '@/components/windows/Terminal';
import PlexWindow from '@/components/windows/Plex';
import FrameWindow from '@/components/windows/Frame';
import TaskbarItem from '@/components/TaskbarItem';
import { VueContext } from 'vue-context';
import CreateIconWindow from '@/components/windows/CreateIcon';
import * as VueWindow from '@hscmap/vue-window'
import Swatches from 'vue-swatches';

import "vue-swatches/dist/vue-swatches.min.css"

Vue.component('window',Window);
Vue.component('taskbar',Taskbar);
Vue.component('taskbaritem',TaskbarItem);
Vue.component('homebutton',HomeButton);
Vue.component('SettingsWindow',SettingsWindow);
Vue.component('PlexWindow',PlexWindow);
Vue.component('TerminalWindow',TerminalWindow);
Vue.component('FrameWindow',FrameWindow);
Vue.component('CreateIconWindow',CreateIconWindow);
Vue.component('swatches',Swatches);
Vue.component('vue-context',VueContext);
Vue.use(VueWindow)

var apps = require.context('@/apps', true, /\.js|\.vue$/);
apps.keys().forEach(apps);