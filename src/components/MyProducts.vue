<template>
  <div class="products pa-4">
    <div class="text-h6">My Products</div>
    <v-data-table
      :headers="headers"
      :items="myproducts"
      sort-by="productId"
      class="elevation-1 mt-2"
      :search="search"
    >
      <template v-slot:[`item.tags`]="{ item }">
        <span v-for="t of item.tags" :key="t">{{ t }},</span>
      </template>

      <template v-slot:[`item.action`]="{ item }">
        <v-menu bottom right>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="editItem(item)"> Edit </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <template v-slot:[`item.productImages`]="{ item }">
        <img
          id="preview"
          height="60px"
          width="60px"
          class="d-flex justify-center align-center"
          :src="item.productImages[0] ? item.productImages[0].toString() : 'Image'"
          alt="Image"
        />
      </template>

      <template v-slot:top>
        <v-toolbar flat>
          <v-row>
            <v-col cols="12" md="3" lg="4">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                hide-details
              ></v-text-field>
            </v-col>
            <v-spacer></v-spacer>
          </v-row>
          <v-dialog v-model="dialog" max-width="60%" persistent>
            <v-card>
              <v-form ref="form">
                <v-toolbar flat>
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span></v-card-title
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
                        v-model="editedItem.name"
                        label="Product Name"
                        :rules="[
                          !!editedItem.name || 'This field can not be empty',
                        ]"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedItem.productType"
                        :items="['FOOD', 'NONFOOD']"
                        label="Product Type"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedItem.veg"
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
                        v-model="editedItem.tags"
                        :items="productTags"
                        label="Product Tags"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedItem.tasteMeter"
                        label="Taste Meter"
                        :items="tasteMeters"
                        item-text="name"
                        return-object
                      ></v-select>
                      <!-- :rules="[
                          !!editedItem.tasteMeter ||
                            'This field can not be empty',
                        ]"
                        required -->
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.servingSize"
                        label="Serving Size"
                        :rules="[
                          !!editedItem.servingSize ||
                            'This field can not be empty',
                        ]"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.availableQuantity"
                        label="Available Quantity"
                        :rules="[
                          !!editedItem.availableQuantity ||
                            'This field can not be empty',
                        ]"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.productPrice"
                        label="Prod. Price Inclusive Of GST"
                        :rules="[
                          !!editedItem.productPrice ||
                            'This field can not be empty',
                        ]"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.description"
                        label="Prod. Description"
                        :rules="[
                          !!editedItem.description ||
                            'This field can not be empty',
                        ]"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-text-field
                        v-model="editedItem.specialInstructions"
                        label="Special. Instructions"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-file-input
                        label="Product Image"
                        @change="uploadImage($event)"
                      ></v-file-input>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="grey darken-1" dark @click="close"
                    >Cancel</v-btn
                  >
                  <v-btn color="pink" dark @click="save">Save</v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data: () => ({
    search: "",
    dialog: false,
    editedItem: {},
    myproducts: [],
    unsubscribe: "",
    editedIndex: -1,
    defaultItem: {},
    productTags: [],
    imageData: null,
    tasteMeters: [],
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New  product" : "Edit  product";
    },
    headers() {
      let headers = [
        { text: "", value: "action", align: "start", sortable: false },
        {
          text: "Product Id.",
          value: "productId",
          width: "120px",
          align: "center",
        },
        //{ text: "Seller Id", value: "sellerId", width: "100px" },
        { text: "Product Thumbnail", value: "productImages", width: "180px" },
        { text: "Product Name", value: "name", width: "180px" },
        { text: "Product Type", value: "productType", width: "150px" },
        { text: "Tags", value: "tags", width: "200px" },
        { text: "Taste Meter", value: "tasteMeter.name", width: "180px" },
        { text: "Veg /Non-Veg", value: "veg", width: "150px" },
        { text: "Serving Size", value: "servingSize", width: "180px" },
        { text: "Available Qty", value: "availableQuantity", width: "180px" },
        {
          text: "Prod. Price inclusive of GST",
          value: "productPrice",
          width: "220px",
        },
        { text: "Description", value: "description", width: "250px" },
        {
          text: "Special Instructions",
          value: "specialInstructions",
          width: "250px",
        },
      ];

      return headers;
    },
  },

  /* watch: {
    dialog(val) {
      val || this.close();
    },*/

  beforeDestroy() {
    this.unsubscribe();
  },
  created() {
    this.unsubscribe = this.$store.subscribe((mutation) => {
      if (mutation.type === "setMyProducts" && mutation.payload) {
        this.myproducts = JSON.parse(mutation.payload);
      }
      if (mutation.type === "setProductTags" && mutation.payload) {
        this.productTags = JSON.parse(mutation.payload);
      }
      if (mutation.type === "setMedia" && mutation.payload) {
        this.imageData = JSON.parse(mutation.payload);
      }
      if (mutation.type === "setTasteMeters" && mutation.payload) {
        this.tasteMeters = JSON.parse(mutation.payload);
      }
    });
    // let param = {
    //   sellerId: 1,
    // };
    this.getMyproducts();
    this.getProductTags();
    this.getTasteMeters();
  },
  methods: {
    ...mapActions([
      "getMyproducts",
      "editProducts",
      "getProductTags",
      "addMedia",
      "getTasteMeters",
    ]),

    editItem(item) {
      this.editedIndex = this.myproducts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      //this.imageData = this.editedItem.productImages[0].toString();
      this.dialog = true;
    },

    uploadImage(e) {
      if (e) {
        console.log("file", e);
        let formData = new FormData();
        formData.append("file", e);
        this.addMedia(formData);
      }
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.$refs.form.reset();
      });
    },

    save() {
      if (this.$refs.form.validate()) {
        let arr = [];
        if (this.imageData !== null) {
          arr.push(this.imageData.url);
          this.editedItem.productImages = arr;
        }
        let param = {
          productId: this.editedItem.productId,
          name: this.editedItem.name,
          productType: this.editedItem.productType,
          tags: this.editedItem.tags,
          tasteMeter: this.editedItem.tasteMeter,
          veg: this.editedItem.veg,
          servingSize: this.editedItem.servingSize,
          availableQuantity: this.editedItem.availableQuantity,
          productPrice: this.editedItem.productPrice,
          description: this.editedItem.description,
          productImages: this.editedItem.productImages,
          specialInstructions: this.editedItem.specialInstructions,
        };
        this.editProducts(param);
      }
      this.close();
    },
  },
};
</script>

<style scoped>
</style>