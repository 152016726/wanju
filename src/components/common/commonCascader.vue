<template>
  <div class="commonCascader clearfix">
    <i class="fl iconText">{{text}}</i>
    <el-cascader
      class="selection fl"
      v-model="areaValue"
      :options="options"
      @active-item-change="handleSearchItemChange"
      :placeholder="placeholderText"
      :disabled="isDisabled"
    >
    </el-cascader>
  </div>
</template>

<script>
  const cityMember = 4;               // 市管理员
  const provinceMember = 5;           // 省管理员
  export default {
    name: "commonCascader",
    data() {
      return {
        areaValue: this.value,
        options: []               // selection数组
      }
    },
    props: {
      value: {default: ()=>[]},                      // 双向绑定value
      text: {default: ''},                      // title
      roleType: {default: ''},                  // 角色类型
      isDisabled: {default: false},             // 是否可编辑
      placeholderText: {default: '请输入内容'}
    },
    watch: {
      value:{
        handler: (val)=>{
          this.areaValue = val;
        },
        deep: true
      },
      areaValue(val) {
        this.$emit('input', val)
      },
      roleType(){
        this.initData()
      }
    },
    methods: {
      /**
       * 搜索
       */
      handleSearchItemChange(val) {
        this.options.some(item => {
          // 一联判断赋值
          if (item.value === val[0]) {
            if(this.roleType === provinceMember){
              delete item.children;
              return true
            }
            this.getRegion(val[0], (data)=>{
              item.children = data.map(val=>{
                let pObj = {
                  label: val.name,
                  value: val.unitId
                };
                if(this.roleType !== cityMember){
                  pObj["children"] = [];
                }
                return pObj
              })


              // 二联判断赋值
              if (val[1]) {
                item.children.some(k => {
                  if(this.roleType === cityMember) {
                    delete k.children;
                    return false
                  }else{
                    if (k.value === val[1]) {
                      if (!k.children.length) {
                        this.getRegion(val[1], (data)=>{
                          k.children = data.map(key=>{
                            return{
                              label: key.name,
                              value: key.unitId,
                            }
                          })
                        })
                      }
                      return true
                    } else {
                      return false
                    }
                  }

                });
                return true
              } else {
                return true
              }
            })

          } else {
            return false
          }
        })
      },
      /**
       * 获取下级列表
       * @param parentId
       * @param callback
       */
      getRegion(parentId, callback) {
        this.$post('region/getChild', {parentId}).then(rsp => {
          callback(rsp.datas)
        }, rej => {
          if(rej.data.errcode === 460){
            this.$message.error(rej.data.datas[0].message);
          }else{
            this.$message.error(rej.data.errmsg);
          }})
      },
      initData(){
        this.getRegion('', (data) => {
          this.options = data.map(item => {
            let pObj = {
              label: item.name,
              value: item.unitId
            };
            if(this.roleType !== provinceMember){
              pObj["children"] = [];
            }
            return pObj;
          });
          this.handleSearchItemChange(this.value);
        });
      }
    },
    created() {
      // 数据回显时加的一些操作待定根据接口而来
      this.initData()

    }
  }
</script>

<style lang="scss">
@import "../../style/commonCascader.scss";
</style>
