import React, { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

interface Sede {
  id: number;
  nombre: string;
}

interface SedeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sede: Omit<Sede, "id"> | Sede) => void;
  initialData?: Sede | null;
  title?: string;
}

export const SedeModal: React.FC<SedeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  title = "Institución",
}) => {
  const [formData, setFormData] = useState({
    nombre: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre,
      });
    } else {
      setFormData({
        nombre: "",
      });
    }
    setError("");
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (error) setError("");
  };

  const handleSubmit = () => {
    if (!formData.nombre.trim()) {
      setError("El nombre de la sede es obligatorio");
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
          <Label htmlFor="nombre">Nombre de la Sede</Label>
          <Input
            id="nombre"
            type="text"
            placeholder="Ingrese el nombre"
            value={formData.nombre}
            onChange={handleChange}
            error={!!error}
            hint={error}
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
