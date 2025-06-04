import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useLoginUserMutation } from "@/api/loginWithApi";
import { errorValidatingWithToast } from "@/utils/ErrorValidation";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [loginUser, { isLoading }] = useLoginUserMutation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await loginUser(formData).unwrap();
            navigate('/', { replace: true });
            toast.success("Login successful");
        } catch (error) {
            errorValidatingWithToast(error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center">Login</h2>
                <form className="space-y-4" onSubmit={handleSave}>
                    <div>
                        <Label htmlFor="username" className="block text-sm font-medium">
                            Username
                        </Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="username"
                            className="w-full mt-1"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="password" className="block text-sm font-medium">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="password"
                            className="w-full mt-1"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <Button disabled={isLoading} type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
                        Login
                    </Button>
                </form>
            </div>
        </div>
    );
}
