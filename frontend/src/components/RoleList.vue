<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="roles"
      :items-per-page="5"
      class="elevation-1"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Role Management</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn color="primary" class="mb-2" @click="openDialog()">
            NEW ROLE
          </v-btn>
        </v-toolbar>
      </template>
      
      <template #[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="openAssignPermissions(item)">
          mdi-key
        </v-icon>
        <v-icon small @click="deleteItem(item)">
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
                <v-text-field v-model="editedItem.name" label="Role name"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="close">Cancel</v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogAssignPermissions" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Assign Permissions</span>
        </v-card-title>
        <v-card-text>
          <v-select
            v-model="selectedPermissions"
            :items="availablePermissions"
            item-title="name"
            item-value="_id"
            label="Permissions"
            multiple
            chips
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeAssignPermissions">Cancel</v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="assignPermissions">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const roles = ref([]);
const dialog = ref(false);
const dialogDelete = ref(false);
const dialogAssignPermissions = ref(false);

const defaultItem = {
  name: '',
};

const editedIndex = ref(-1);
const editedItem = ref({ ...defaultItem });
const selectedRole = ref(null);
const selectedPermissions = ref([]);
const availablePermissions = ref([]);

const formTitle = computed(() => {
  return editedIndex.value === -1 ? 'New Role' : 'Edit Role';
});

const headers = [
  { title: 'Name', align: 'start', key: 'name' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center', width: '150px' },
];

onMounted(async () => {
  await initialize();
});

const initialize = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/roles');
    roles.value = response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
  }
};

const deleteItem = (item) => {
  editedIndex.value = roles.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialogDelete.value = true;
};

const deleteItemConfirm = async () => {
  try {
    await axios.delete(`http://localhost:3000/api/roles/${editedItem.value._id}`);
    roles.value.splice(editedIndex.value, 1);
    closeDelete();
  } catch (error) {
    console.error('Error deleting role:', error);
  }
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
    const response = await axios.post('http://localhost:3000/api/roles', editedItem.value);
    roles.value.push(response.data);
    close();
    await initialize();
  } catch (error) {
    console.error('Error saving role:', error);
  }
};

const openDialog = () => {
  editedIndex.value = -1;
  editedItem.value = Object.assign({}, defaultItem);
  dialog.value = true;
};

const openAssignPermissions = async (item) => {
  selectedRole.value = item;
  try {
    const [permissionsResponse, roleResponse] = await Promise.all([
      axios.get('http://localhost:3000/api/permissions'),
      axios.get(`http://localhost:3000/api/roles/${item._id}`),
    ]);
    availablePermissions.value = permissionsResponse.data;
    selectedPermissions.value = roleResponse.data.permissions.map(permission => permission._id);
    dialogAssignPermissions.value = true;
  } catch (error) {
    console.error('Error fetching permissions:', error);
  }
};

const closeAssignPermissions = () => {
  dialogAssignPermissions.value = false;
  selectedRole.value = null;
  selectedPermissions.value = [];
};

const assignPermissions = async () => {
  try {
    await axios.post(`http://localhost:3000/api/roles/${selectedRole.value._id}/permissions`, {
      permissions: selectedPermissions.value,
    });
    await initialize();
    closeAssignPermissions();
  } catch (error) {
    console.error('Error assigning permissions:', error);
  }
};
</script>

<style scoped>
.v-data-table :deep(.v-data-table__wrapper) > table > tbody > tr > td,
.v-data-table :deep(.v-data-table__wrapper) > table > thead > tr > th {
  padding: 0 16px;
}

.v-data-table :deep(.v-data-table__wrapper) > table > tbody > tr > td:last-child {
  padding-right: 0;
}

.v-icon.v-icon--size-default {
  font-size: 20px;
}

.v-data-table :deep(.v-data-table__wrapper) > table > thead > tr > th {
  font-weight: bold;
  text-transform: uppercase;
}
</style>