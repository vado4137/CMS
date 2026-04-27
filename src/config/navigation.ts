import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  FileText, 
  Calendar, 
  ShieldAlert,
  MapPin,
  Building2,
  GraduationCap, // NEU hinzugefügt
  History
} from "lucide-react";

export const MANAGEMENT_NAV = [
  { name: "Übersicht", href: "", icon: "dashboard" },
  { name: "Mein Profil", href: "/my-profile", icon: "users" },
  // Das operative Zentrum für alle Officer und Ausbilder
  { 
    name: "Ausbildungszentrum", 
    href: "/trainings", 
    icon: "graduation", 
    permission: "VIEW_TRAINING" 
  }, 
  { name: "Mitgliederliste", href: "/members", icon: "users", permission: "MANAGE_MEMBERS" },
  { name: "Kalender", href: "/calendar", icon: "calendar", permission: "VIEW_CALENDAR"  },
  { name: "Dokumente", href: "/documents", icon: "files", permission: "VIEW_DOCUMENTS" },
];

export const SETTINGS_NAV = [
  { name: "Ränge & Rechte", href: "/settings/ranks", icon: "shield", permission: "MANAGE_RANKS" },
  { name: "Abteilungen", href: "/settings/departments", icon: "building", permission: "MANAGE_DEPARTMENTS" },
  { name: "Standorte", href: "/settings/locations", icon: "map", permission: "MANAGE_LOCATIONS" },
  // Hier werden nur die Typen/Vorlagen verwaltet
  { 
    name: "Trainings-Katalog", 
    href: "/settings/trainings/types", 
    icon: "files", 
    permission: "MANAGE_TRAININGTYPES" 
  },
  { name: "Audit Logs", href: "/settings/audit-logs", icon: "history", permission: "MANAGE_FACTION" },
];