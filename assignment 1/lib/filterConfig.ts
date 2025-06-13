import {
  Briefcase,
  Building,
  MapPin,
  Users,
  GraduationCap,
  Globe,
} from "lucide-react";
import type { FilterConfig } from "@/types/filters";

export const filterConfig: FilterConfig[] = [
  { key: "jobTitle", label: "Job Title", icon: Briefcase, required: true },
  { key: "company", label: "Company", icon: Building, required: true },
  { key: "location", label: "Location", icon: MapPin, required: true },
  {
    key: "experienceLevel",
    label: "Experience Level",
    icon: Users,
    required: true,
  },
  { key: "industry", label: "Industry", icon: Building, required: true },
  {
    key: "profileLanguage",
    label: "Profile Language",
    icon: Globe,
    required: true,
  },
  {
    key: "currentCompany",
    label: "Current Company",
    icon: Building,
    required: false,
  },
  {
    key: "pastCompany",
    label: "Past Company",
    icon: Building,
    required: false,
  },
  { key: "school", label: "School", icon: GraduationCap, required: false },
  {
    key: "yearsOfExperience",
    label: "Years of Experience",
    icon: Users,
    required: false,
  },
  { key: "function", label: "Function", icon: Briefcase, required: false },
  {
    key: "seniorityLevel",
    label: "Seniority Level",
    icon: Users,
    required: false,
  },
];
