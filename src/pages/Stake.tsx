
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
import { Coins, TrendingUp, Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";

const Stake = () => {
  const [balance, setBalance] = useState(1000); // Mock user balance
  const [stakeAmount, setStakeAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [stakedAmount, setStakedAmount] = useState(0);
  const [lockPeriod, setLockPeriod] = useState("3weeks");
  const [apy, setApy] = useState(12);
  const [earnings, setEarnings] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [progress, setProgress] = useState(0);
  
  // Calculate APY based on lock period
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
  
  // Simulate earnings growth
  useEffect(() => {
    const timer = setInterval(() => {
      if (stakedAmount > 0) {
        // Calculate daily earnings based on APY
        const dailyRate = apy / 365 / 100;
        const newEarnings = earnings + (stakedAmount * dailyRate) / 24; // Hourly simulation
        setEarnings(newEarnings);
        
        // Update progress
        setProgress(prev => (prev < 100 ? prev + 0.1 : 0));
      }
    }, 1000); // Update every second for demo purposes
    
    return () => clearInterval(timer);
  }, [stakedAmount, earnings, apy]);
  
  const handleStake = () => {
    const amount = parseFloat(stakeAmount);
    if (isNaN(amount) || amount <= 0 || amount > balance) return;
    
    const newStakedAmount = stakedAmount + amount;
    setStakedAmount(newStakedAmount);
    setBalance(balance - amount);
    
    // Add transaction record
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
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0 || amount > stakedAmount) return;
    
    const newStakedAmount = stakedAmount - amount;
    setStakedAmount(newStakedAmount);
    setBalance(balance + amount + (amount * apy / 100) * (progress / 100));
    
    // Add transaction record
    const transaction = {
      id: Date.now(),
      type: "Withdraw",
      amount: amount,
      date: new Date().toLocaleString(),
      earnings: (amount * apy / 100) * (progress / 100)
    };
    
    setTransactions([transaction, ...transactions]);
    setWithdrawAmount("");
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4">Stake SYX</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="bg-black border border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-streamixy-primary" />
              Available Balance
            </CardTitle>
            <CardDescription className="text-white/70">
              Your available SYX tokens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{balance.toFixed(2)} <span className="text-streamixy-primary">SYX</span></p>
          </CardContent>
        </Card>
        
        <Card className="bg-black border border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-streamixy-primary" />
              Staking Rewards
            </CardTitle>
            <CardDescription className="text-white/70">
              Your current earnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{earnings.toFixed(4)} <span className="text-streamixy-primary">SYX</span></p>
            <Progress className="mt-2" value={progress} />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="bg-black border border-white/10">
          <CardHeader>
            <CardTitle>Stake Tokens</CardTitle>
            <CardDescription className="text-white/70">
              Lock your SYX tokens to earn rewards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/70 mb-1 block">Amount to Stake</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="bg-transparent border-white/20"
                />
              </div>
              
              <div>
                <label className="text-sm text-white/70 mb-1 block">Lock Period</label>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={lockPeriod === "3weeks" ? "default" : "outline"} 
                    className={lockPeriod === "3weeks" ? "bg-streamixy-primary" : "border-white/20 hover:bg-streamixy-primary/20"}
                    onClick={() => setLockPeriod("3weeks")}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    3 Weeks
                  </Button>
                  <Button 
                    variant={lockPeriod === "6weeks" ? "default" : "outline"}
                    className={lockPeriod === "6weeks" ? "bg-streamixy-primary" : "border-white/20 hover:bg-streamixy-primary/20"}
                    onClick={() => setLockPeriod("6weeks")}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    6 Weeks
                  </Button>
                  <Button 
                    variant={lockPeriod === "3months" ? "default" : "outline"}
                    className={lockPeriod === "3months" ? "bg-streamixy-primary" : "border-white/20 hover:bg-streamixy-primary/20"}
                    onClick={() => setLockPeriod("3months")}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    3 Months
                  </Button>
                </div>
              </div>
              
              <div className="mt-2 p-3 rounded-md bg-streamixy-primary/10 text-sm">
                <p className="flex justify-between">
                  <span>Lock Period:</span>
                  <span className="font-medium">{lockPeriod === "3weeks" ? "3 Weeks" : lockPeriod === "6weeks" ? "6 Weeks" : "3 Months"}</span>
                </p>
                <p className="flex justify-between">
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
              Stake Now
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="bg-black border border-white/10">
          <CardHeader>
            <CardTitle>Withdraw Tokens</CardTitle>
            <CardDescription className="text-white/70">
              Withdraw your staked SYX tokens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/70 mb-1 block">Staked Amount</label>
                <p className="text-xl font-bold">{stakedAmount} <span className="text-streamixy-primary">SYX</span></p>
              </div>
              
              <div>
                <label className="text-sm text-white/70 mb-1 block">Amount to Withdraw</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="bg-transparent border-white/20"
                />
              </div>
              
              <div className="mt-2 p-3 rounded-md bg-streamixy-primary/10 text-sm">
                <p className="flex justify-between">
                  <span>Estimated Rewards:</span>
                  <span className="font-medium">
                    {withdrawAmount && !isNaN(parseFloat(withdrawAmount)) 
                      ? ((parseFloat(withdrawAmount) * apy / 100) * (progress / 100)).toFixed(4) 
                      : "0"} SYX
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-streamixy-primary hover:bg-streamixy-primary/80"
              onClick={handleWithdraw}
              disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > stakedAmount}
            >
              Withdraw
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Card className="bg-black border border-white/10">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-center text-white/50 py-4">No transactions yet</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Details</TableHead>
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
                      <TableCell>{transaction.amount} SYX</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>
                        {transaction.type === "Stake" 
                          ? `Locked for ${transaction.period === "3weeks" ? "3 Weeks" : transaction.period === "6weeks" ? "6 Weeks" : "3 Months"}`
                          : `+${transaction.earnings?.toFixed(4) || 0} SYX rewards`}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Stake;
