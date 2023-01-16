<template>
  <div :class="{fullscreen:fullscreen}" class="tinymce-container" :style="{width:containerWidth}">
    <textarea :id="tinymceId" class="tinymce-textarea"/>
  </div>
</template>

<!--<script src="./tinymce.min.js"></script>-->
<script>
/**
 * docs:
 * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
 */
import {plugins, toolbar, menubar} from './config'
import load from './dynamicLoadScript'
import * as util from './util'

// why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
// const tinymceCDN = 'https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js'
// const tinymceCDN = 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/4.9.3/tinymce.min.js'
const tinymceCDN = 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.0.2/tinymce.min.js'
// const tinymceCDN = 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.2.0/tinymce.min.js'
import filePickerCallback from "./js/filePickerCallback";

export default {
  name: 'TinymceText',
  // components: { editorImage },
  props: {
    id: {
      type: String,
      default: function () {
        return 'vue-tinymce-' + new Date().getTime() + ((Math.random() * 10000).toFixed(0) + '')
      }
    },
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default: () => toolbar
    },
    menubar: {
      type: String,
      required: false,
      default: () => menubar
    },
    plugins: {
      type: Array,
      required: false,
      default: () => plugins
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360
    },
    width: {
      type: [Number, String],
      required: false,
      default: 'auto'
    },
    config: {
      type: Object,
      required: false,
      default() {
        return {}
      },
    }
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false,
      languageTypeList: {
        'en': 'en',
        'zh': 'zh_CN',
        'es': 'es_MX',
        'ja': 'ja'
      }
    }
  },
  computed: {
    containerWidth() {
      const width = this.width
      if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
        return `${width}px`
      }
      return width
    }
  },
  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() =>
            window.tinymce.get(this.tinymceId).setContent(val || ''))
      }
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    if (window.tinymce) {
      this.initTinymce()
    }
  },
  deactivated() {
    this.destroyTinymce()
  },
  destroyed() {
    this.destroyTinymce()
  },
  methods: {
    init() {
      // TODO 此处运行时才动态获取tinymce，这个方式不好，如果tinymceCDN地址挂了，组件也挂了。最好使用
      //  本地的js文件，已经下载好了: tinymce.min.js，但是怎么应用还需要探索下
      const _this = this
      load(tinymceCDN, (err) => {
        if (err) {
          _this.$message.error(err.message)
          return
        }
        _this.initTinymce()
      })
    },
    initTinymce() {
      const _this = this
      let options = {
        selector: `#${_this.tinymceId}`,
        language: _this.languageTypeList['en'],
        width: _this.width,
        height: _this.height,
        body_class: 'panel-body ',
        object_resizing: false,

        toolbar: _this.toolbar.length > 0 ? _this.toolbar : toolbar,
        menubar: _this.menubar.length > 0 ? _this.menubar : menubar,
        plugins: _this.plugins.length > 0 ? _this.plugins : plugins,

        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
        default_link_target: '_blank',
        file_picker_types: 'file image media', // 此选项可以通过空格或逗号分隔的类型名称指定允许上传的类型。目前只有三个可用的值：file、image和media
        file_picker_callback: (callback, value, meta) => {
          const tinymce = window.tinymce.get(this.tinymceId);
          filePickerCallback(callback, value, meta, tinymce, this.config)
        },
        codesample_global_prismjs: true, // 应用本地prism文件(js和css)
        codesample_languages: [
          {text: 'Sql', value: 'sql'},
          {text: 'Properties', value: 'properties'},
          {text: 'HTML/XML', value: 'markup'},
          {text: 'JavaScript', value: 'javascript'},
          {text: 'CSS', value: 'css'},
          {text: 'Java', value: 'java'},
          {text: 'Python', value: 'python'},
          {text: 'Ruby', value: 'ruby'},
          {text: 'C', value: 'c'},
          {text: 'C++', value: 'cpp'},
          {text: 'PHP', value: 'php'}
        ],
        link_title: false,
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        init_instance_callback: editor => {
          if (_this.value) {
            editor.setContent(_this.value)
          }
          _this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            _this.hasChange = true
            _this.$emit('input', editor.getContent())
          })
        },
        setup(editor) {
          editor.on('FullscreenStateChanged', (e) => {
            _this.fullscreen = e.state
          })
        },
        // it will try to keep these URLs intact
        // https://www.tiny.cloud/docs-3x/reference/configuration/Configuration3x@convert_urls/
        // https://stackoverflow.com/questions/5196205/disable-tinymce-absolute-to-relative-url-conversions
        convert_urls: false
      }
      util.reverseMerge(options, _this.config)
      window.tinymce.init(options)
    },
    destroyTinymce() {
      const tinymce = window.tinymce.get(this.tinymceId)
      if (this.fullscreen) {
        tinymce.execCommand('mceFullScreen')
      }

      if (tinymce) {
        tinymce.destroy()
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent()
    }
  }
}
</script>

<style lang="scss" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}

.tinymce-container {
  ::v-deep {
    .mce-fullscreen {
      z-index: 10000;
    }
  }
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}

.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}

.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}

.editor-upload-btn {
  display: inline-block;
}
</style>
<style lang="scss">
.tox.tox-tinymce-aux {
  z-index: 5000;
}
</style>
