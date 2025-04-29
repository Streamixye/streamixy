
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  website: string;
  category: string;
}

// Sample data - in a real app this would come from a database
const initialProducts: Product[] = [
  {
    id: "1",
    name: "StreamFlow",
    description: "Advanced analytics for creators to track audience engagement",
    website: "https://streamflow.example",
    category: "Analytics",
  },
  {
    id: "2",
    name: "ViewrWallet",
    description: "Non-custodial wallet for creator tokens and NFTs",
    website: "https://viewrwallet.example",
    category: "Finance",
  },
  {
    id: "3",
    name: "ContentDAO",
    description: "Decentralized content governance and monetization",
    website: "https://contentdao.example",
    category: "Governance",
  },
];

const ProductsList = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");

  // This function would update when a new product is added via the dialog
  React.useEffect(() => {
    // Listen for custom events from AddProductDialog
    const handleNewProduct = (e: CustomEvent<Product>) => {
      setProducts(prev => [...prev, e.detail]);
    };

    window.addEventListener('new-product-added' as any, handleNewProduct as EventListener);
    
    return () => {
      window.removeEventListener('new-product-added' as any, handleNewProduct as EventListener);
    };
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <Input
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-black/40 border-white/10 text-white"
        />
      </div>
      
      <div className="rounded-md border border-white/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-black/50 hover:bg-black/40">
              <TableHead className="text-white">Name</TableHead>
              <TableHead className="text-white">Description</TableHead>
              <TableHead className="text-white">Category</TableHead>
              <TableHead className="text-white">Link</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id} className="bg-black/20 hover:bg-black/40 border-white/5">
                  <TableCell className="font-medium text-white">{product.name}</TableCell>
                  <TableCell className="text-gray-300">{product.description}</TableCell>
                  <TableCell className="text-gray-300">{product.category}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
                      onClick={() => window.open(product.website, "_blank")}
                    >
                      <Globe className="h-4 w-4 mr-1" /> Visit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-400">
                  No projects found. Try different search terms or add a new project.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductsList;
