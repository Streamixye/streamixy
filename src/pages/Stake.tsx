import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Coins, TrendingUp, ArrowUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";

const Stake = () => {
  const [balance, setBalance] = useState(1000);
  const [stakeAmount, setStakeAmount] = useState("");
  const [stakedAmount, setStakedAmount] = useState(0);
  const [lockPeriod, setLockPeriod] = useState("3weeks");
  const [apy, setApy] = useState(12);
  const [earnings, setEarnings] = useState(0);
  const [showPerformance, setShowPerformance] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    switch(lockPeriod) {
      case "3weeks":
        setApy(12);
        break;
      case "6weeks":
        setApy(18);
        break;
      case "3months":
        setApy(24);
        break;
      default:
        setApy(12);
    }
  }, [lockPeriod]);
  
  useEffect(() => {
    const timer = setInterval(() => {
      if (stakedAmount > 0) {
        const dailyRate = apy / 365 / 100;
        const newEarnings = earnings + (stakedAmount * dailyRate) / 24;
        setEarnings(newEarnings);
        setProgress(prev => (prev < 100 ? prev + 0.1 : 0));
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [stakedAmount, earnings, apy]);
  
  const handleStake = () => {
    const amount = parseFloat(stakeAmount);
    if (isNaN(amount) || amount <= 0 || amount > balance) return;
    
    const newStakedAmount = stakedAmount + amount;
    setStakedAmount(newStakedAmount);
    setBalance(balance - amount);
    setShowPerformance(true);
    
    const transaction = {
      id: Date.now(),
      type: "Stake",
      amount: amount,
      date: new Date().toLocaleString(),
      period: lockPeriod
    };
    
    setTransactions([transaction, ...transactions]);
    setStakeAmount("");
  };
  
  const handleWithdraw = () => {
    if (stakedAmount <= 0) return;
    
    const newBalance = balance + stakedAmount + earnings;
    setBalance(newBalance);
    
    const transaction = {
      id: Date.now(),
      type: "Withdraw",
      amount: stakedAmount,
      date: new Date().toLocaleString(),
      earnings: earnings
    };
    
    setTransactions([transaction, ...transactions]);
    setStakedAmount(0);
    setEarnings(0);
    setProgress(0);
    setShowPerformance(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4 text-white">Stake SYX</h1>
      
      {showPerformance && (
        <Card className="bg-black border border-white/10 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="h-5 w-5 text-streamixy-primary" />
              Staking Performance 
            </CardTitle>
            <CardDescription className="text-white">
              Your current earnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-3xl font-bold text-white">{earnings.toFixed(4)} <span className="text-streamixy-primary">SYX</span></p>
              <Progress className="mt-2" value={progress} />
              <Button 
                className="w-full bg-streamixy-primary hover:bg-streamixy-primary/80"
                onClick={handleWithdraw}
              >
                Withdraw All ({stakedAmount.toFixed(2)} SYX)
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card className="bg-black border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Stake Tokens</CardTitle>
          <CardDescription className="text-white">
            Lock your SYX tokens to earn rewards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-white mb-1 block">Amount to Stake</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                className="bg-transparent border-white/20"
              />
            </div>
            
            <div>
              <label className="text-sm text-white mb-1 block">Lock Period</label>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={lockPeriod === "3weeks" ? "default" : "outline"} 
                  className={lockPeriod === "3weeks" ? "bg-streamixy-primary" : "border-white/20 hover:bg-streamixy-primary/20"}
                  onClick={() => setLockPeriod("3weeks")}
                >
                  3 Weeks
                </Button>
                <Button 
                  variant={lockPeriod === "6weeks" ? "default" : "outline"}
                  className={lockPeriod === "6weeks" ? "bg-streamixy-primary" : "border-white/20 hover:bg-streamixy-primary/20"}
                  onClick={() => setLockPeriod("6weeks")}
                >
                  6 Weeks
                </Button>
                <Button 
                  variant={lockPeriod === "3months" ? "default" : "outline"}
                  className={lockPeriod === "3months" ? "bg-streamixy-primary" : "border-white/20 hover:bg-streamixy-primary/20"}
                  onClick={() => setLockPeriod("3months")}
                >
                  3 Months
                </Button>
              </div>
            </div>
            
            <div className="mt-2 p-3 rounded-md bg-streamixy-primary/10 text-sm">
              <p className="flex justify-between text-white">
                <span>Lock Period:</span>
                <span className="font-medium">{lockPeriod === "3weeks" ? "3 Weeks" : lockPeriod === "6weeks" ? "6 Weeks" : "3 Months"}</span>
              </p>
              <p className="flex justify-between text-white">
                <span>APY:</span>
                <span className="font-medium">{apy}%</span>
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-streamixy-primary hover:bg-streamixy-primary/80"
            onClick={handleStake}
            disabled={!stakeAmount || parseFloat(stakeAmount) <= 0 || parseFloat(stakeAmount) > balance}
          >
            <ArrowUp className="h-4 w-4 mr-2" />
            Stake Now
          </Button>
        </CardFooter>
      </Card>
      
      {transactions.length > 0 && (
        <Card className="bg-black border border-white/10 mt-6">
          <CardHeader>
            <CardTitle className="text-white">Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white">Type</TableHead>
                    <TableHead className="text-white">Amount</TableHead>
                    <TableHead className="text-white">Date</TableHead>
                    <TableHead className="text-white">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map(transaction => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <Badge className={transaction.type === "Stake" ? "bg-streamixy-primary" : "bg-streamixy-accent"}>
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white">{transaction.amount} SYX</TableCell>
                      <TableCell className="text-white">{transaction.date}</TableCell>
                      <TableCell className="text-white">
                        {transaction.type === "Stake" 
                          ? `Locked for ${transaction.period === "3weeks" ? "3 Weeks" : transaction.period === "6weeks" ? "6 Weeks" : "3 Months"}`
                          : `+${transaction.earnings?.toFixed(4) || 0} SYX rewards`}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Stake;
