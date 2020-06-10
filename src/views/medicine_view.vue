<template>
  <b-container>
    <b-modal centered size="lg" v-model="visible" ok-only :title="`medicine prescription-${data.prescription_no}`">
      <b-table hover head-variant="light" small striped
               :items="data.treatment_medicine" responsive :fields="fields" class="text-left">
        <template v-slot:cell(morning)="data">

          <b-form-checkbox
            id="checkbox-1"
            v-model="data.item.morning"
            name="checkbox-1"
            disabled
          ></b-form-checkbox>

        </template>
        <template v-slot:cell(evening)="data">
          <b-form-checkbox
            id="checkbox-1"
            v-model="data.item.evening"
            name="checkbox-1"
            disabled
          ></b-form-checkbox>
        </template>
        <template v-slot:cell(night)="data">
          <b-form-checkbox
            id="checkbox-1"
            v-model="data.item.night"
            name="checkbox-1"
            disabled
          ></b-form-checkbox>
        </template>
        <template v-slot:cell(Action)="data" v-if="$auth.check('Medical')">
          <b-button variant="primary" size="sm" :disabled="data.item.remaining_tablets==0"
                    @click="update_data=data.item;second_model=!second_model">
            Update Purchased Tablet
          </b-button>
        </template>
      </b-table>
    </b-modal>
    <b-modal id="model2" v-if="$auth.check('Medical')&&update_data" centered size="sm" v-model="second_model" ok-only
             :title="`Update-Medicine ${update_data.medicine_name}`">
      <b-container>
        <b-row>
          <span class="font-weight-bold">Total Tablets: {{update_data.total_tablets}}</span>
          <span class="font-weight-bold">already Purchased Tablets: {{update_data.purchased_tablets}}</span>
          <span class="font-weight-bold">Remaining Tablets : {{update_data.remaining_tablets}}</span>
          <span>
        <label for="update_tablet" style="margin-bottom: 0px; font-size: 14px;">
                Update Purchased Tablet:
              </label>
              <b-form-input id="update_tablet" type="number" v-model="update_tablet" size="sm" name="update_tablet"
                            required v-validate="'required|min_value:0|max_value:'+update_data.remaining_tablets"
                            :state="validateState('update_tablet')" data-vv-name="update_tablet">
              </b-form-input>
      </span>
        </b-row>
      </b-container>
      <template v-slot:modal-footer="{}">
        <b-overlay
          :show="loading"
          rounded
          opacity="0.6"
          spinner-small
          spinner-variant="primary"
          class="d-inline-block"
        >
          <b-button varient="primary" @click="updateTablet()">Update Tablet</b-button>
        </b-overlay>
      </template>
    </b-modal>
  </b-container>
</template>

<script>
  export default {
    name: "medicine_view",
    props: ['modalShow', 'data'],
    data() {
      return {
        loading: false,
        visible: false,
        second_model: false,
        update_data: [],
        update_tablet: null,
        fields: [
          {
            key: 'medicine_name',
            sortable: false,
            label: 'Medicine Name',
          },
          {
            key: 'medicine_for_days',
            sortable: false,
            label: 'Medicine Days'
          },
          {
            key: 'total_tablets',
            sortable: false,
            label: 'Total Tablets'
          },
          {
            key: 'morning',
            sortable: false,
            label: 'Morning'
          },
          {
            key: 'evening',
            label: 'Evening',
            sortable: false,
          },
          {
            key: 'night',
            label: 'Night',
            sortable: false,
            stickyColumn: false,
          },
          {
            key: 'purchased_tablets',
            label: 'Purchased',
            sortable: false,
            stickyColumn: false,
          }
        ],
      }
    },
    created() {
      if (this.$auth.check('Medical')) {
        this.fields.push({
          key: 'Action',
          label: 'Action',
          sortable: false,
          stickyColumn: false,
        })
      }
    },
    methods: {
      validateState(ref) {
        if (
          this.veeFields[ref] &&
          (this.veeFields[ref].dirty || this.veeFields[ref].validated)
        ) {
          return !this.veeErrors.has(ref);
        }
        return null;
      },
      updateTablet() {
        this.loading = true;
        this.$validator.validateAll().then(isValid => {
          if (isValid) {
            let update = {id: this.update_data.id, update_tablet: this.update_tablet};
            this.axios.post('update-tablet/', update).then(response => {
              if (response) {
                this.$bvToast.toast('Purchased Tablet Updated successfully', {
                  title: 'Success',
                  variant: 'success',
                  autoHideDelay: 4000,
                });
                this.loading = false;
                this.second_model = false;
                this.$emit('callList');
                this.visible = false;
              }
            }).catch((error) => {
              this.loading = false;
              this.$bvToast.toast(error.response.data, {
                title: 'Failed',
                variant: 'danger',
                autoHideDelay: 4000,
              });
            })
          }
          else {
            this.$bvToast.toast('Please fill Required fields', {
              title: 'Recent Purchased tablet',
              variant: 'danger',
              autoHideDelay: 4000,
            });
          }
        });
      },
    },
    watch: {
      modalShow() {
        this.visible = true
      }
    }
  }
</script>

<style scoped>

</style>
