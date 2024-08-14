<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="permissions"
      :items-per-page="5"
      class="elevation-1"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Permission Management</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn color="primary" class="mb-2" @click="openDialog()">
            New Permission
          </v-btn>
        </v-toolbar>
      </template>

      <template #[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="editedItem.name" label="Permission name"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const permissions = ref([]);
const dialog = ref(false);
const dialogDelete = ref(false);

const defaultItem = {
  name: '',
};

const editedIndex = ref(-1);
const editedItem = ref({ ...defaultItem });

const formTitle = computed(() => {
  return editedIndex.value === -1 ? 'New Permission' : 'Edit Permission';
});

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Actions', key: 'actions', sortable: false, width: '150px'},
];

onMounted(async () => {
  await initialize();
});

const initialize = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/permissions');
    permissions.value = response.data;
  } catch (error) {
    console.error('Error fetching permissions:', error);
  }
};

const deleteItem = (item) => {
  editedIndex.value = permissions.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialogDelete.value = true;
};

const deleteItemConfirm = async () => {
  try {
    await axios.delete(`http://localhost:3000/api/permissions/${editedItem.value._id}`);
    permissions.value.splice(editedIndex.value, 1);
    closeDelete();
  } catch (error) {
    console.error('Error deleting permission:', error);
  }
};

const openDialog = () => {
  editedIndex.value = -1;
  editedItem.value = Object.assign({}, defaultItem);
  dialog.value = true;
};

const close = () => {
  dialog.value = false;
  editedIndex.value = -1;
  editedItem.value = Object.assign({}, defaultItem);
};

const closeDelete = () => {
  dialogDelete.value = false;
  editedIndex.value = -1;
  editedItem.value = Object.assign({}, defaultItem);
};

const save = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/permissions', editedItem.value);
    permissions.value.push(response.data);
    close();
  } catch (error) {
    console.error('Error saving permission:', error);
  }
};
</script>