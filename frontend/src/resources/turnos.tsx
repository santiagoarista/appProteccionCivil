import {
  List,
  Datagrid,
  TextField,
  SimpleList,
  EditButton,
  Edit,
  Create,
  Show,
  SimpleForm,
  SimpleShowLayout,
  TextInput,
  ReferenceArrayField,
  ReferenceArrayInput,
  SingleFieldList,
  ChipField,
  AutocompleteArrayInput,
} from "react-admin";
import { useMediaQuery, Theme } from "@mui/material";

export const TurnoList = () => {
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  return (
    <List title="Lista de Turnos">
      {isSmall ? (
        <SimpleList
          primaryText={(r) => r.nombre}
          secondaryText={(r) => r.horario}
          tertiaryText={(r) => `Paramédicos: ${r.colaboradores?.length || 0}`}
        />
      ) : (
        <Datagrid rowClick="show">
          <TextField source="nombre" label="Nombre del Turno" />
          <ReferenceArrayField
            source="colaboradores"
            reference="users"
            label="Paramédicos"
          >
            <SingleFieldList>
              <ChipField source="fullName" />
            </SingleFieldList>
          </ReferenceArrayField>
          <EditButton label="Editar" />
        </Datagrid>
      )}
    </List>
  );
};

export const TurnoEdit = () => (
  <Edit title="Editar Turno">
    <SimpleForm>
      <TextInput disabled source="id" label="ID" />
      <TextInput source="nombre" label="Nombre del Turno" />
      <TextInput source="horario" label="Horario" />
      <ReferenceArrayInput
        source="colaboradores"
        reference="users"
        label="Paramédicos"
      >
        <AutocompleteArrayInput
          optionText="fullName"
          optionValue="id"
          label="Seleccionar Paramédicos"
        />
      </ReferenceArrayInput>
    </SimpleForm>
  </Edit>
);

export const TurnoCreate = () => (
  <Create title="Crear Turno">
    <SimpleForm>
      <TextInput source="nombre" label="Nombre del Turno" />
      <TextInput source="horario" label="Horario" />
      <ReferenceArrayInput
        source="colaboradores"
        reference="users"
        label="Paramédicos"
      >
        <AutocompleteArrayInput
          optionText="fullName"
          optionValue="id"
          label="Seleccionar Paramédicos"
        />
      </ReferenceArrayInput>
    </SimpleForm>
  </Create>
);

export const TurnoShow = () => (
  <Show title="Detalles del Turno">
    <SimpleShowLayout>
      <TextField source="nombre" label="Nombre del Turno" />
      <TextField source="horario" label="Horario" />
      <ReferenceArrayField
        source="colaboradores"
        reference="users"
        label="Paramédicos"
      >
        <SingleFieldList>
          <ChipField source="fullName" />
        </SingleFieldList>
      </ReferenceArrayField>
    </SimpleShowLayout>
  </Show>
);
