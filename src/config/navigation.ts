import { 
    LayoutDashboard, 
    Users, 
    Settings, 
    FileText, 
    Calendar, 
    ShieldAlert,
    MapPin,
    Building2
  } from "lucide-react";
  
  export const MANAGEMENT_NAV = [
    { name: "Übersicht", href: "", icon: "dashboard" },
    { name: "Mein Profil", href: "/my-profile", icon: "users" },
    { name: "Mitgliederliste", href: "/members", icon: "users", permission: "MANAGE_MEMBERS" },
    { name: "Events & Termine", href: "/events", icon: "calendar", permission: "VIEW_EVENTS" },
    { name: "Dokumente", href: "/documents", icon: "files", permission: "VIEW_DOCUMENTS" },
  ];
  
  export const SETTINGS_NAV = [
    { name: "Ränge & Rechte", href: "/settings/ranks", icon: "shield", permission: "MANAGE_RANKS" },
    { name: "Abteilungen", href: "/settings/departments", icon: "building", permission: "MANAGE_DEPARTMENTS" },
    { name: "Standorte", href: "/settings/locations", icon: "map", permission: "MANAGE_LOCATIONS" },
    { name: "Ausbildungen", href: "/settings/trainings", icon: "files", permission: "MANAGE_TRAININGTYPES" },
  ];