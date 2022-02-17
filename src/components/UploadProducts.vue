<template>
  <div class="upload pa-4">
    <div class="text-h5">Upload Product Portfolio</div>
    <v-data-table
      :headers="columns"
      :items="data"
      sort-by="SlNo"
      class="elevation-1 mt-2"
    >
      <template v-slot:[`item.action`]="{ item }">
        <v-menu bottom right>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="edit(item)"> Edit </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <template v-slot:top>
        <v-toolbar flat>
          <input
            type="file"
            accept=".xls,.xlsx"
            @change="readExcel"
            class="mt-2"
            ref="uploadFile"
          />
          <v-spacer></v-spacer>
          <v-row class="justify-space-around">
            <v-btn @click="exportExcel" color="primary" text class="btn mt-1">
              <v-icon class="pa-2" color="green">mdi-file-excel-box</v-icon>
              Download master copy
            </v-btn>
            <v-btn color="pink" @click="onSubmit" dark v-if="data.length > 0"
              >Save</v-btn
            >
            <v-btn
              color="grey darken-1"
              @click="clearAll"
              dark
              v-if="data.length > 0"
              >Cancel</v-btn
            >
          </v-row>

          <v-dialog v-model="dialog" max-width="60%" persistent>
            <v-card>
              <v-form ref="form">
                <v-toolbar flat>
                  <v-card-title>
                    <span class="text-h5">Edit Product</span></v-card-title
                  >
                  <v-spacer></v-spacer>
                  <v-btn icon light @click="close">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.ProductName"
                        label="Product Name"
                        :rules="[
                          !!editedItem.ProductName ||
                            'This field can not be empty',
                        ]"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedItem.ProductType"
                        :items="['FOOD', 'NONFOOD']"
                        label="Product Type"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedItem.Veg_NonVeg"
                        :items="[
                          { text: 'Veg', value: true },
                          { text: 'NON-Veg', value: false },
                        ]"
                        label="Veg/Non-Veg"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                     <v-select
                        multiple
                        item-text="name"
                        item-value="name"
                        :reduce="(productTags) => option.name"
                        v-model="editedItem.Tags"
                        :items="productTags"
                        label="Product Tags"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                     <v-select
                        v-model="editedItem.TasteMeter"
                        label="Taste Meter"
                        :items="tasteMeters"
                        item-text="name"
                        return-object
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.ServingSize"
                        label="Serving Size"
                        :rules="[
                          !!editedItem.ServingSize ||
                            'This field can not be empty',
                        ]"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.AvailableQuantity"
                        label="Available Quantity"
                        :rules="[
                          !!editedItem.AvailableQuantity ||
                            'This field can not be empty',
                        ]"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.ProductPriceIncludingGST"
                        label="Prod. Price Inclusive Of GST"
                        :rules="[
                          !!editedItem.ProductPriceIncludingGST ||
                            'This field can not be empty',
                        ]"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.ProductDescription"
                        label="Prod. Description"
                        :rules="[
                          !!editedItem.ProductDescription ||
                            'This field can not be empty',
                        ]"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-text-field
                        v-model="editedItem.SpecialInstructions"
                        label="Special. Instructions"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="grey darken-1" dark @click="close"
                    >Cancel</v-btn
                  >
                  <v-btn color="pink" dark @click="updateItem">Save</v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <template v-slot:[`item.productImages`]="{ item }">
        <input
          type="file"
          accept="image/*"
          label="Upload Product image"
          @change="onChange(item, $event)"
          class="btn"
        />
      </template>
    </v-data-table>
  </div>
</template>

<script>
import XLSX from "xlsx";
import Toast from "../views/Toast";
import { mapActions } from "vuex";

export default {
  name: "Stamps",
  data() {
    return {
      item: {
        image: null,
        imageUrl: null,
      },
      dialog: false,
      editedItem: {},
      data: [],
      columns: [
        {
          text: "",
          value: "action",
          width: "20px",
          align: "start",
          sortable: false,
        },
        { text: "SlNo", value: "SlNo", width: "100px" },
        { text: "Product Thumbnail", value: "productImages", width: "180px" },
        { text: "ProductName", value: "ProductName", width: "180px" },
        {
          text: "ProductType",
          value: "ProductType",
          width: "180px",
        },
        { text: "Veg/NonVeg", value: "Veg_NonVeg", width: "150px" },
        { text: "Tags", value: "Tags", width: "200px" },
        {
          text: "Taste Meter",
          value: "TasteMeter",
          width: "150px",
        },
        { text: "ServingSize", value: "ServingSize", width: "150px" },
        {
          text: "AvailableQuantity",
          value: "AvailableQuantity",
          width: "180px",
        },
        {
          text: "ProductPriceIncludingGST",
          value: "ProductPriceIncludingGST",
          width: "200px",
        },
        {
          text: "Description",
          value: "ProductDescription",
          width: "250px",
        },
        {
          text: "Special Instructions",
          value: "SpecialInstructions",
          width: "250px",
        },
      ],
      // Export excel data
      excelData: [
        {
          SlNo: "",
          ProductName: "",
          ProductType: "",
          Veg_NonVeg: "",
          Tags: "",
          TasteMeter: "",
          ServingSize: "",
          AvailableQuantity: "",
          ProductPriceIncludingGST: "",
          Description: "",
          SpecialInstructions: "",
        },
      ],
      selectedItem: null,
      imageData: null,
      productTags: [],
      tasteMeters:[]
    };
  },

  //computed: mapState(["media"]),
  // watch: {
  //   media(newValue, oldValue) {
  //     console.log("sd", newValue, oldValue);
  //   },
  // },

  beforeDestroy() {
     this.unsubscribe();
    this.unwatch();
  },

  created() {
    this.unsubscribe = this.$store.subscribe((mutation) => {
      if (mutation.type === "setUploadMessage" && mutation.payload) {
        this.clearAll();
      }
      if (mutation.type === "setProductTags" && mutation.payload) {
        this.productTags = JSON.parse(mutation.payload);
      }
      if (mutation.type === "setTasteMeters" && mutation.payload) {
        this.tasteMeters = JSON.parse(mutation.payload);
      }
    });

    this.getProductTags();
    this.getTasteMeters();

    this.unwatch = this.$store.watch(
      (state, getters) => getters.getMedia,
      (newValue, oldValue) => {
        console.log(`Updating from ${oldValue} to ${newValue}`);

        // Do whatever makes sense now
       // if (newValue !== null) {
         let value = JSON.parse(newValue);
          for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].SlNo === this.selectedItem.SlNo) {
              this.data[i].productImages.push(value.url);
            }
          }
        //}
      },
      // (state, getters) => getters.getUploadProdMsg,
      // (newValue, oldValue) => {
      //   console.log(`Updating from ${oldValue} to ${newValue}`);
      //   //if (newValue !== null) {
      //     if (newValue.success === true) {
      //       this.clearAll();
      //     }
      //   //}
      // }
    );
  },

  // computed(){
  //   for(let i=0; i< this.data.length;i++){
  //     this.data[i]["productImages"] = [];
  //   }
  //   return this.data;
  // },

  methods: {
    ...mapActions(["addMedia", "uploadProducts","getProductTags","getTasteMeters",]),
    onChange(r, e) {
      // console.log("row", e);
      // for (let i = 0; i < this.data.length; i++) {
      //   if (this.data[i].SlNo == r.SlNo) {
      //     this.data[i]["image"] = e.target.files[0];
      //   }
      // }
      // const file = e.target.files[0];
      // this.image = file;
      // this.item.imageUrl = URL.createObjectURL(file);
      // console.log("imgg", this.item.imageUrl);
      this.selectedItem = r;
      if (e) {
        let formData = new FormData();
        formData.append("file", e.target.files[0]);
        this.addMedia(formData);
      }
    },

    onSubmit() {
      let obj = [];
      for (let i = 0; i < this.data.length; i++) {
        let obj1 = {
          availableQuantity: this.data[i].AvailableQuantity,
          description: this.data[i].Description,
          name: this.data[i].ProductName,
          productId: 0,
          productImages: this.data[i].productImages,
          productPrice: this.data[i].ProductPriceIncludingGST,
          productType: this.data[i].ProductType,
          servingSize: this.data[i].ServingSize,
          specialInstructions: this.data[i].SpecialInstructions,
          tags: this.data[i].Tags,
          tasteMeter: this.data[i].TasteMeter,
          veg: this.data[i].Veg_NonVeg,
        };
        obj.push(obj1);
      }
      console.log("submitData", obj);
      this.uploadProducts(obj);
    },

    // readExcel(e) {
    //   console.log("logg", e);
    //   console.log("logg1", e.target.files);
    //   /* const files = e; */
    //   const files = e.target.files || e.dataTransfer.files[0];
    //   const fileReader = new FileReader(); // construction function that can read the file content
    //   fileReader.onload = (ev) => {
    //     const data = ev.target.result;
    //     const workbook = XLSX.read(data, {
    //       type: "array", // binary
    //     });

    //     workbook.SheetNames.forEach((val) => {
    //       const wsname = val;
    //       const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);
    //       console.log("ws data", ws.length);
    //       ws.forEach((item) => {
    //         // console.log("item" , item);
    //         // console .log("sa", i);
    //         this.data.push(item);
    //       });
    //     });
    //     console.log("data", this.data);
    //   };
    //   fileReader.readAsArrayBuffer(files[0]); // read file, trigger onload
    // },

    readExcel(e) {
      // console.log("logg", e);
      // console.log("logg1", e.target.files);
      /* const files = e; */
      const files = e.target.files || e.dataTransfer.files[0];
      const fileReader = new FileReader(); // construction function that can read the file content
      fileReader.onload = (ev) => {
        const data = ev.target.result;
        const workbook = XLSX.read(data, {
          type: "array", // binary
        });

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        let workSheet = XLSX.utils.sheet_to_json(worksheet, {
          defval: "",
          blankrows: true,
          header: "A",
          raw: true,
          rawNumbers: true,
        });
        //console.log("jj", workSheet);
        if (workSheet[0].A !== "SlNo") {
          Toast.showToast(
            "You Changed SlNo ColumnName, \nPlease Refer the Table header and Change accordingly",
            "E"
          );
        } else if (workSheet[0].B !== "ProductName") {
          Toast.showToast(
            "You Changed ProductName ColumnName, \nPlease Refer the Table header and Change accordingly",
            "E"
          );
        } else if (workSheet[0].C !== "ProductType") {
          Toast.showToast(
            "You Changed ProductType ColumnName, \nPlease Refer the Table header and Change accordingly",
            "E"
          );
        } else if (workSheet[0].D !== "Veg_NonVeg") {
          Toast.showToast(
            "You Changed ColumnName,\nPlease Refer the Table header and Change accordingly",
            "E"
          );
        } else if (workSheet[0].E !== "Tags") {
          Toast.showToast(
            "You Changed Tags ColumnName,\nPlease Refer the Table header and Change accordingly",
            "E"
          );
        } else if (workSheet[0].F !== "TasteMeter") {
          Toast.showToast(
            "You Changed TasteMeter ColumnName,\nPlease Refer the Table header and Change accordingly",
            "E"
          );
        } else if (workSheet[0].G !== "ServingSize") {
          Toast.showToast(
            "You Changed ServingSize ColumnName,\nPlease Refer the Table header and Change accordingly",
            "E"
          );
        } else if (workSheet[0].H !== "AvailableQuantity") {
          Toast.showToast(
            "You Changed AvailableQuantity ColumnName,\nPlease Refer the Table header and Change accordingly",
            "E"
          );
        } else if (workSheet[0].I !== "ProductPriceIncludingGST") {
          Toast.showToast(
            "You Changed ProductPriceIncludingGST ColumnName,\nPlease Refer the Table header and Change accordingly",
            "E"
          );
        } else if (workSheet[0].J !== "Description") {
          Toast.showToast(
            "You Changed Description ColumnName,\nPlease Refer the Table header and Change accordingly",
            "E"
          );
        } else if (workSheet[0].K !== "SpecialInstructions") {
          Toast.showToast(
            "You Changed SpecialInstructions ColumnName ,\nPlease Refer the Table header and Change accordingly",
            "E"
          );
        } else {
          const ws = XLSX.utils.sheet_to_json(worksheet, {
            defval: "",
          });
          ws.forEach((item) => {
            //console.log("sdfds", JSON.stringify(item));
            if (item.SlNo !== "" && item.ProductName !== "") {
              item["productImages"] = [];
              //let tags = [];
              if(item.Tags!=null || item.Tags!="" || item.Tags != "undefined");
              console.log("before", typeof(item.Tags));
              let array = item.Tags.split(',');
              item.Tags =[];
              item.Tags = array.slice();
              console.log("after",  item.Tags);

              this.data.push(item);
            }
          });
        }

        console.log("data", this.data);

        /*  workbook.SheetNames.forEach((val) => {
          const wsname = val;
          console.log("ws name", wsname);
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname], {
            defval: "",
          });
          console.log("ws data", ws);
          ws.forEach((item) => {
            console.log("sdfds", JSON.stringify(item));
            if (item.SlNo !== "" && item.ProductName !== "") {
              this.data.push(item);
            }
          });
        });
       */
      };
      fileReader.readAsArrayBuffer(files[0]); // read file, trigger onload
    },

    exportExcel() {
      const jsonWorkSheet = XLSX.utils.json_to_sheet(this.excelData);
      const workBook = {
        SheetNames: ["jsonWorkSheet"], // sheet name
        Sheets: {
          jsonWorkSheet: jsonWorkSheet,
        },
      };
      XLSX.writeFile(workBook, "upload.xlsx");
    },

    edit(item) {
     // console.log(item);
      this.dialog = true;
      this.editedItem = item;
    },

    updateItem() {
      this.data.filter((item) => {
        if (item.SlNo === this.editedItem.SlNo) {
          item.SlNo = this.editedItem.SlNo;
          item.ProductName = this.editedItem.ProductName;
          item.ProductType = this.editedItem.ProductType;
          item.Veg_Non_veg = this.editedItem.Veg_Non_veg;
          item.Tags = this.editedItem.Tags;
          item.TasteMeter = this.editedItem.TasteMeter;
          item.ServingSize = this.editedItem.ServingSize;
          item.AvailableQuantity = this.editedItem.AvailableQuantity;
          item.ProductPriceinclusiveofGST = this.editedItem.ProductDescription;
          item.SpecialInstructions = this.editedItem.SpecialInstructions;
          return item;
        }
      });
      this.dialog = false;
      this.editedItem = Object.assign(this.editedItem, {});
      console.log("updatedItem", this.data);
    },

    close() {
      this.dialog = false;
      this.editedItem = Object.assign(this.editedItem, {});
    },
    clearAll() {
      this.$refs.uploadFile.value = null;
      this.data = [];
    },
  },
};
</script>

<style scoped>
.btn {
  text-transform: none !important;
}

::-webkit-file-upload-button {
  background: rgb(117, 150, 240);
  color: white;
  padding: 5px 10px;
  font-size: 15px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  border-color: rgb(117, 150, 240);
  transition: all 0.15s ease;
  letter-spacing: 1px;
  box-sizing: border-box;
  outline: none;
  cursor: pointer;
  line-height: 1.5;
  display: inline-block;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  border: 1px solid transparent;
  text-transform: capitalize;
}
</style>