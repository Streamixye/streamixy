
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ArrowUp, ArrowDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Transaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  amount: string;
  token: string;
  timestamp: string;
  type: "send" | "receive" | "mint" | "burn";
}

// Sample transaction data 
const sampleTransactions: Transaction[] = [
  {
    id: "1",
    hash: "0x3f5ceb5429cf2b6a9d8ef40c8a4fdd7e4e15a21c3c97e9768ddfc82d47e9df65",
    from: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    to: "0x8c3bF98Ee94536A2603BB92F551CeA37B0c51FB9",
    amount: "150.5",
    token: "MCT",
    timestamp: "2025-04-29T14:52:32Z",
    type: "send",
  },
  {
    id: "2",
    hash: "0x9a8e442c13ee1c0eb40f831c55c7ead8c2b3f36fc27e6479b192a2879c2ca632",
    from: "0x0000000000000000000000000000000000000000",
    to: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    amount: "10000",
    token: "CCT",
    timestamp: "2025-04-29T12:31:24Z",
    type: "mint",
  },
  {
    id: "3",
    hash: "0x1d8f7e7a6fe23a12ec8d45e62c8c3225ee32122ef5835b9987e286677462c7a9",
    from: "0x8c3bF98Ee94536A2603BB92F551CeA37B0c51FB9",
    to: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    amount: "75.25",
    token: "MCT",
    timestamp: "2025-04-29T10:15:44Z",
    type: "receive",
  },
];

const Explorer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const { toast } = useToast();

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast({
        variant: "destructive",
        title: "Search error",
        description: "Please enter an address or transaction hash.",
      });
      return;
    }

    setIsLoading(true);

    // Simulate search with delay
    setTimeout(() => {
      // If it looks like an address
      if (searchTerm.startsWith("0x") && searchTerm.length === 42) {
        const filtered = sampleTransactions.filter(
          tx => tx.from.toLowerCase() === searchTerm.toLowerCase() || 
                tx.to.toLowerCase() === searchTerm.toLowerCase()
        );
        
        setTransactions(filtered.length > 0 ? filtered : []);
        
        if (filtered.length === 0) {
          toast({
            title: "No transactions found",
            description: "No transactions found for this address.",
          });
        }
      } 
      // If it looks like a transaction hash
      else if (searchTerm.startsWith("0x") && searchTerm.length === 66) {
        const found = sampleTransactions.find(
          tx => tx.hash.toLowerCase() === searchTerm.toLowerCase()
        );
        
        if (found) {
          setTransactions([found]);
        } else {
          setTransactions([]);
          toast({
            title: "Transaction not found",
            description: "No transaction with this hash was found.",
          });
        }
      } 
      // Neither an address nor a transaction hash
      else {
        toast({
          variant: "destructive",
          title: "Invalid format",
          description: "Please enter a valid address or transaction hash.",
        });
        setTransactions(sampleTransactions);
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          placeholder="Search by address or tx hash..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-black/40 border-white/20 text-white"
        />
        <Button 
          onClick={handleSearch} 
          disabled={isLoading}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          {isLoading ? "Searching..." : <Search className="h-4 w-4" />}
        </Button>
      </div>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-black/20 backdrop-blur-md border border-white/10 rounded-lg">
          <TabsTrigger value="transactions" className="data-[state=active]:text-purple-400">
            Transactions
          </TabsTrigger>
          <TabsTrigger value="tokens" className="data-[state=active]:text-purple-400">
            Tokens
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="p-1">
          <div className="rounded-md border border-white/10 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-black/50 hover:bg-black/40">
                  <TableHead className="text-white">Tx Hash</TableHead>
                  <TableHead className="text-white">Type</TableHead>
                  <TableHead className="text-white">From / To</TableHead>
                  <TableHead className="text-white">Amount</TableHead>
                  <TableHead className="text-white">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <TableRow key={tx.id} className="bg-black/20 hover:bg-black/40 border-white/5">
                      <TableCell className="font-mono text-xs text-purple-400">
                        {`${tx.hash.substring(0, 8)}...${tx.hash.substring(58)}`}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {tx.type === "send" && <ArrowUp className="h-4 w-4 text-red-500 mr-1" />}
                          {tx.type === "receive" && <ArrowDown className="h-4 w-4 text-green-500 mr-1" />}
                          {tx.type === "mint" && <span className="h-4 w-4 text-blue-500 mr-1">⊕</span>}
                          {tx.type === "burn" && <span className="h-4 w-4 text-orange-500 mr-1">⊖</span>}
                          <span className="text-gray-300 capitalize">{tx.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="text-xs">From: <span className="font-mono text-gray-400">{`${tx.from.substring(0, 6)}...${tx.from.substring(38)}`}</span></div>
                          <div className="text-xs">To: <span className="font-mono text-gray-400">{`${tx.to.substring(0, 6)}...${tx.to.substring(38)}`}</span></div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-white">{tx.amount}</span>
                        <span className="text-gray-400 ml-1">{tx.token}</span>
                      </TableCell>
                      <TableCell className="text-gray-400 text-xs">
                        {new Date(tx.timestamp).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="tokens" className="p-1">
          <div className="rounded-md border border-white/10 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-black/50 hover:bg-black/40">
                  <TableHead className="text-white">Token</TableHead>
                  <TableHead className="text-white">Symbol</TableHead>
                  <TableHead className="text-white">Contract Address</TableHead>
                  <TableHead className="text-white">Network</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="bg-black/20 hover:bg-black/40 border-white/5">
                  <TableCell className="font-medium text-white">My Creator Token</TableCell>
                  <TableCell className="text-gray-300">MCT</TableCell>
                  <TableCell className="font-mono text-xs text-purple-400">0x742d35Cc6634C0532925a3b844Bc454e4438f44e</TableCell>
                  <TableCell>
                    <span className="inline-block px-2 py-1 rounded-full text-xs bg-indigo-900/50 text-indigo-300">Mainnet</span>
                  </TableCell>
                </TableRow>
                <TableRow className="bg-black/20 hover:bg-black/40 border-white/5">
                  <TableCell className="font-medium text-white">Creator Community Token</TableCell>
                  <TableCell className="text-gray-300">CCT</TableCell>
                  <TableCell className="font-mono text-xs text-purple-400">0x8c3bF98Ee94536A2603BB92F551CeA37B0c51FB9</TableCell>
                  <TableCell>
                    <span className="inline-block px-2 py-1 rounded-full text-xs bg-purple-900/50 text-purple-300">Testnet</span>
                  </TableCell>
                </TableRow>
                <TableRow className="bg-black/20 hover:bg-black/40 border-white/5">
                  <TableCell className="font-medium text-white">Streamixy Governance</TableCell>
                  <TableCell className="text-gray-300">SGT</TableCell>
                  <TableCell className="font-mono text-xs text-purple-400">0x1a2Bc89a123C34D0b36A787b8cD54c1f3CA67544</TableCell>
                  <TableCell>
                    <span className="inline-block px-2 py-1 rounded-full text-xs bg-indigo-900/50 text-indigo-300">Mainnet</span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Explorer;
