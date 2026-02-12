import React, { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

interface Institucion {
  id: number;
  nombre: string;
  direccion: string;
  tipo: string;
}

interface InstitucionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (institucion: Omit<Institucion, "id"> | Institucion) => void;
  initialData?: Institucion | null;
  title?: string;
}

export const InstitucionModal: React.FC<InstitucionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  title = "Institución",
}) => {
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    tipo: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre,
        direccion: initialData.direccion,
        tipo: initialData.tipo,
      });
    } else {
      setFormData({
        nombre: "",
        direccion: "",
        tipo: "",
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...formData,
      ...(initialData ? { id: initialData.id } : {}),
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="nombre">Nombre de la Institución</Label>
          <Input
            id="nombre"
            type="text"
            placeholder="Ingrese el nombre"
            value={formData.nombre}
            onChange={handleChange}
            error={!!errors.nombre}
            hint={errors.nombre}
          />
        </div>
        <div>
          <Label htmlFor="direccion">Dirección</Label>
          <Input
            id="direccion"
            type="text"
            placeholder="Ingrese la dirección"
            value={formData.direccion}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="tipoInstitucion">Tipo de Institución</Label>
          <Input
            id="tipo"
            type="text"
            placeholder="Ingrese el tipo (ej. Fiscal, Particular)"
            value={formData.tipo}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          className="dark:bg-gray-600 dark:hover:bg-gray-700"
        >
          Guardar
        </Button>
      </div>
    </Modal>
  );
};
