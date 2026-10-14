"use client";

import { useSyncExternalStore } from "react";

export interface ConfirmacionData {
  insurer?: string;
  plan?: string;
  premium?: number;
  ticketId?: string | number;
  logo?: string;
}

const STORAGE_KEY = "segurautos_confirmacion_data";

let cachedRaw: string | null = null;
let cachedData: ConfirmacionData | null = null;

const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(callback: () => void) {
  listeners.add(callback);

  const handleStorage = (event: StorageEvent) => {
    if (event.storageArea === window.sessionStorage && (event.key === STORAGE_KEY || event.key === null)) {
      cachedRaw = null;
      callback();
    }
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", handleStorage);
  };
}

function getSnapshot(): ConfirmacionData | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) {
      return cachedData;
    }
    cachedRaw = raw;
    cachedData = raw ? (JSON.parse(raw) as ConfirmacionData) : null;
    return cachedData;
  } catch (error) {
    console.error("Error al leer datos de confirmación en sessionStorage:", error);
    return null;
  }
}

const getServerSnapshot = (): ConfirmacionData | null => null;

/**
 * Guarda los datos de confirmación en sessionStorage y notifica a los suscriptores.
 */
export function saveConfirmacionData(data: ConfirmacionData) {
  if (typeof window === "undefined") return;

  try {
    const serialized = JSON.stringify(data);
    window.sessionStorage.setItem(STORAGE_KEY, serialized);
    cachedRaw = serialized;
    cachedData = data;
    emitChange();
  } catch (error) {
    console.error("Error al guardar datos de confirmación en sessionStorage:", error);
  }
}

/**
 * Elimina los datos de confirmación de sessionStorage y notifica a los suscriptores.
 */
export function clearConfirmacionData() {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
    cachedRaw = null;
    cachedData = null;
    emitChange();
  } catch (error) {
    console.error("Error al limpiar datos de confirmación en sessionStorage:", error);
  }
}

/**
 * Hook para suscribirse reactivamente a los datos de confirmación en sessionStorage.
 * Cumple con 'no-use-effect' al usar useSyncExternalStore con getSnapshot estable.
 */
export function useConfirmacionStore(): ConfirmacionData | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
