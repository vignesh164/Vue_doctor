<template>
  <b-container>
    <br>
    <b-row v-if="$auth.check('Medical')">
      <label for="prescript_no" style="margin-bottom: 0px; font-size: 14px;">
        Enter Prescription No:
      </label>
      <b-input-group>
        <b-input-group-prepend is-text>
          <b-icon icon="search"></b-icon>
        </b-input-group-prepend>
        <b-form-input id="prescript_no" v-model="prescription_no" @keyup.enter="getData()"></b-form-input>
      </b-input-group>
    </b-row>
    <b-row>
      <b-table v-if="check" hover head-variant="light" small :busy="loading" striped caption-top
               :items="items" responsive :fields="fields" class="text-left">
        <template v-slot:table-caption>
          <b-row class="mr-0 ml-0">
            <b-col sm=5 md="8" lg="10">
              <span class="h5">  History of {{$auth.check(['Doctor']) ? 'Patient' : 'Doctor'}} visited.</span>
            </b-col>
            <b-col sm="5" md="4" lg="2" v-if="$auth.check(['Doctor'])">
              <b-button variant="primary" @click="$router.push('new-patient')">New Patient</b-button>
            </b-col>
            <b-col sm="2">
              <b-button pill variant="info" @click="getData()">
                <b-icon icon="arrow-clockwise" :animation="loading ? 'spin': ''"></b-icon>
              </b-button>
            </b-col>
          </b-row>
        </template>
        <template v-slot:table-busy>
          <div class="text-center text-primary my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong> Loading...</strong>
          </div>
        </template>
        <template v-slot:cell(treatment_date)="data">
              <span v-if="data.item.treatment_date">
                {{ data.item.treatment_date | moment("DD-MM-YYYY, h:mm:ss a")}}
              </span>
        </template>
        <template v-slot:cell(medicine)="data">
          <b-button variant="outline-primary" v-if="data"
                    @click="medicine_data=data.item;show_model=!show_model">view
          </b-button>
        </template>
      </b-table>
      <medicine :modalShow="show_model" @callList="getData()" :data="medicine_data" v-if="medicine_data"></medicine>
    </b-row>
  </b-container>
</template>

<script>
  import medicine from "./medicine_view";

  export default {
    name: "main_page",
    data() {
      return {
        check: false,
        prescription_no:'',
        loading: false,
        show_model: false,
        medicine_data: [],
        fields: [
          {
            key: 'treatment_date',
            sortable: true,
            label: 'Date',
          },
          {
            key: this.$auth.check('Doctor')? 'patient_name': 'doctor_name',
            sortable: false,
            label: this.$auth.check('Doctor')? 'Patient Name': 'Doctor Name'
          },
          {
            key: 'prescription_no',
            sortable: false,
            label: 'Prescription No'
          },
          {
            key: 'description',
            label: 'Disease Description',
            sortable: false,
          },
          {
            key: 'medicine',
            label: 'View Medicine',
            sortable: false,
            stickyColumn: true,
          }
        ],
        items: [],
      }
    },
    created() {
      if(!this.$auth.check('Medical')) {
        this.check=true;
        this.getData();
      }
      else{
        this.fields.splice(2,0, {
          key: 'patient_name',
          sortable: true,
          label: 'Patient Name',
        },);
        this.check=true;
      }
    },
    methods: {
      getData() {
        this.loading = true;
        this.axios.get('medicine/treatment-history/?prescription_no='+this.prescription_no).then(response => {
          if (response) {
            this.items = response.data;
            this.loading = false;
          }
        }).catch((error) => {
          this.loading = false;
          this.$bvToast.toast(error.toString(), {
            title: 'Failed',
            variant: 'danger',
            autoHideDelay: 4000,
          });
        });
      },

    },
    components: {
      medicine
    }
  }
</script>

<style scoped>

</style>
