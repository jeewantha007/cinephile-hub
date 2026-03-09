import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => (
  <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 flex-wrap">
    <Link to="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
      <Home className="h-3.5 w-3.5" />
      <span>Home</span>
    </Link>
    {items.map((item, i) => (
      <span key={i} className="flex items-center gap-1.5">
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
        {item.href ? (
          <Link to={item.href} className="hover:text-foreground transition-colors">
            {item.label}
          </Link>
        ) : (
          <span className="text-foreground font-medium">{item.label}</span>
        )}
      </span>
    ))}
  </nav>
);

export default Breadcrumbs;
