<template>
    <b-container fluid class="pr-4 pl-4">
      <b-card class="mt-2" no-body>
        <b-card-body  id="nav-scroller" style="position:relative; height:450px; overflow-y:scroll;">
      <h3>New Patient Treatment</h3>
      <b-row class="pr-5 pl-5">
        <label for="patient" style="margin-bottom: 0px; font-size: 14px;">
          Select Patient Name *:
        </label>
        <b-form-select
          v-model="new_patient.patient_id"
          :options="options"
          value-field="id"
          text-field="username"
          v-validate="'required'"
          :state="validateState('patient')"
          data-vv-name="patient"
          id="patient"
        ></b-form-select>
        <br>
        <label for="description" style="margin-bottom: 0px; font-size: 14px;">
          Enter disease description *:
        </label>
        <b-form-textarea
          id="description"
          size="sm"
          v-model="new_patient.description"
          v-validate="'required'"
          data-vv-name="description"
          :state="validateState('description')"
        ></b-form-textarea>
      </b-row>
      <br>
        <h4>Medicines</h4>
      <b-row class="text-left" v-for="(data, index) in new_patient.treatment_medicine" :key="index">
        <b-col sm="5">
          <label for="medicine_name" style="margin-bottom: 0px; font-size: 14px;">
            Medicine Name *
          </label>
          <b-form-input :id='`medicine_name${index}`'
                        v-model="data.medicine_name"
                        v-validate="'required'"
                        :data-vv-name="`medicine_name${index}`"
                        :state="validateState('medicine_name'+index)"
          ></b-form-input>
        </b-col>
        <b-col sm="2">
          <label for="days" style="margin-bottom: 0px; font-size: 14px;">
            Medicine days to take *
          </label>
          <b-form-input type="number" id='`days${index}`'
                        v-model="data.medicine_for_days"
                        v-validate="'required'"
                        :data-vv-name="`days${index}`"
                        :state="validateState('days'+index)"
          ></b-form-input>
        </b-col>
        <b-col sm="1">
          <label for="checkbox-1" style="margin-bottom: 0px; font-size: 14px;">
            Morning
          </label>
          <b-form-checkbox
            v-model="data.morning"
            :id="`morning${index}`"
            :name="`morning${index}`"
            v-validate="(data.morning+data.evening+data.night)>0 ? '': 'required:true'"
            :data-vv-name="`morning${index}`"
            :state="validateState('morning'+index)"
          ></b-form-checkbox>
        </b-col>
        <b-col sm="1">
          <label for="checkbox-2" style="margin-bottom: 0px; font-size: 14px;">
            Evening
          </label>
          <b-form-checkbox
            v-model="data.evening"
            id="checkbox-2"
            name="checkbox-2"
          ></b-form-checkbox>
        </b-col>
        <b-col sm="1">
          <label for="checkbox-3" style="margin-bottom: 0px; font-size: 14px;">
            Night
          </label>
          <b-form-checkbox
            v-model="data.night"
            id="checkbox-3"
            name="checkbox-3"
          ></b-form-checkbox>
        </b-col>
        <b-col v-if="new_patient.treatment_medicine.length===1">
          <b-button size="sm" variant="primary"  @click="addMedicine()">
            <b-icon icon="plus" aria-label="add row"></b-icon> Add Another Medicine
          </b-button>
        </b-col>
        <b-col v-if="new_patient.treatment_medicine.length>1">
          <b-button size="sm" variant="danger" @click="removeMedicine(index)">
            <b-icon icon="x" aria-label="remove row"></b-icon> Remove Medicine
          </b-button>
        </b-col>
        <span v-if="veeErrors.first('morning'+index)" style="color:red">
            Please select one of Morning or evening or night in a medicine row
        </span>
      </b-row>
      <br>
      <b-row>
      <b-col v-if="new_patient.treatment_medicine.length>1" right>
        <b-button size="sm" variant="primary" pill style="font-size: 20px" @click="addMedicine()">
          <b-icon icon="plus" aria-label="add row"></b-icon>
        </b-button>
      </b-col>
      </b-row>
        </b-card-body>
        <template v-slot:footer>
          <b-row align-h="end">
            <b-col cols="1">
              <b-button size="sm" @click="$router.push('/')" variant="danger">Cancel</b-button>
            </b-col>
            <b-col cols="2">
              <b-overlay
                :show="loading"
                rounded
                opacity="0.6"
                spinner-small
                spinner-variant="primary"
                class="d-inline-block"
              >
                <b-button size="sm" variant="primary" @click="saveTreatment()">Save</b-button>
              </b-overlay>
            </b-col>
          </b-row>
        </template>
      </b-card>
    </b-container>
</template>

<script>
  export default {
    name: "new_patient",
    data(){
      return{
        loading: false,
        new_patient:{
          patient_id: null,
          description: null,
          treatment_medicine: [
            {medicine_name: null,
              medicine_for_days: null,
              morning: false,
              evening: false,
              night: false,
            }
          ]
        },
        options: [],
      }
    },
    created(){
      this.getPatients();
    },
    methods:{
      validateState(ref) {
        if (
          this.veeFields[ref] &&
          (this.veeFields[ref].dirty || this.veeFields[ref].validated)
        ) {
          return !this.veeErrors.has(ref);
        }
        return null;
      },
      getPatients(){
        this.axios.get('patients').then(response => {
          if (response) {
            this.options = response.data.data;
          }
        }).catch((error) => {
          this.$bvToast.toast(error.toString(), {
            title: 'Failed',
            variant: 'danger',
            autoHideDelay: 4000,
          });
        })
      },
      addMedicine(){
        this.new_patient.treatment_medicine.push(
          {
            medicine_name  : null,
            medicine_for_days: null,
            morning: false,
            evening: false,
            night: false,
          },
        );
      },
      removeMedicine(index) {
        this.new_patient.treatment_medicine.splice(index, 1);
      },
      saveTreatment(){
        this.loading = true;
        this.$validator.validateAll().then(isValid => {
          if(isValid) {
            this.axios.post('medicine/treatment-history/', this.new_patient).then(response => {
              if (response) {
                this.$bvToast.toast('Saved successfully', {
                  title: 'Success',
                  variant: 'success',
                  autoHideDelay: 4000,
                });
                this.loading = false;
                this.$router.push('/')
              }
            }).catch((error) => {
              this.loading = false;
              this.$bvToast.toast(error.response.data, {
                title: 'Failed',
                variant: 'danger',
                autoHideDelay: 4000,
              });
            });
          }
          else{
            this.loading = false;
            this.$bvToast.toast('Please Fill required Fields', {
              title: 'Failed',
              variant: 'danger',
              autoHideDelay: 4000,
            });
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
