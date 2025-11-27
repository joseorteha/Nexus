export interface Company {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  logo?: string;
  imageUrl?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  ownerId?: string;
}

export interface CompanyCardProps {
  company: Company;
  onViewDetails: (id: string) => void;
}

export interface CompanyModalProps {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface CatalogFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  categories: string[];
  minRating: number;
  onMinRatingChange: (value: number) => void;
}

export interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => Promise<void>;
  isLoading?: boolean;
}


/* editado para subir */