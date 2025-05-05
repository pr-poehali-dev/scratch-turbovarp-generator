
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ProjectGenerator } from "@/components/ProjectGenerator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [platform, setPlatform] = useState("scratch");
  const [includeSprites, setIncludeSprites] = useState(true);
  const [includeBackgrounds, setIncludeBackgrounds] = useState(true);
  const [includeMusic, setIncludeMusic] = useState(false);
  const [projectData, setProjectData] = useState<null | { title: string, description: string, url: string }>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = () => {
    if (!prompt) return;
    
    setIsLoading(true);
    // Имитация генерации проекта
    setTimeout(() => {
      const newProject = {
        title: `${prompt.slice(0, 20)}${prompt.length > 20 ? '...' : ''}`,
        description: `Проект ${platform === 'scratch' ? 'Scratch' : 'TurboWarp'} создан на основе запроса: ${prompt}`,
        url: platform === 'scratch' 
          ? `https://scratch.mit.edu/projects/example/?prompt=${encodeURIComponent(prompt)}`
          : `https://turbowarp.org/editor?prompt=${encodeURIComponent(prompt)}`
      };
      setProjectData(newProject);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-purple-800 mb-3">Генератор проектов Scratch/TurboWarp</h1>
          <p className="text-xl text-gray-600">Создавайте уникальные проекты по вашему запросу</p>
        </header>

        <Tabs defaultValue="generator" className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="generator">Генератор</TabsTrigger>
            <TabsTrigger value="examples">Примеры проектов</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generator">
            <Card>
              <CardHeader>
                <CardTitle>Создайте новый проект</CardTitle>
                <CardDescription>Опишите, что вы хотите создать, и выберите настройки</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="prompt" className="text-lg font-medium mb-2 block">Ваш запрос:</Label>
                    <Textarea 
                      id="prompt"
                      placeholder="Например: игра-платформер с котом, который собирает монеты"
                      className="min-h-[120px]"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="platform" className="text-lg font-medium mb-2 block">Платформа:</Label>
                      <Select value={platform} onValueChange={setPlatform}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите платформу" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scratch">Scratch</SelectItem>
                          <SelectItem value="turbowarp">TurboWarp</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium mb-2">Дополнительные опции:</h3>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="sprites">Включить спрайты</Label>
                        <Switch 
                          id="sprites" 
                          checked={includeSprites} 
                          onCheckedChange={setIncludeSprites} 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="backgrounds">Включить фоны</Label>
                        <Switch 
                          id="backgrounds" 
                          checked={includeBackgrounds} 
                          onCheckedChange={setIncludeBackgrounds} 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="music">Включить музыку</Label>
                        <Switch 
                          id="music" 
                          checked={includeMusic} 
                          onCheckedChange={setIncludeMusic} 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleGenerate} 
                    className="w-full" 
                    disabled={!prompt || isLoading}
                    size="lg"
                  >
                    {isLoading ? "Генерация..." : "Сгенерировать проект"}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {projectData && <ProjectGenerator projectData={projectData} />}
          </TabsContent>
          
          <TabsContent value="examples">
            <Card>
              <CardHeader>
                <CardTitle>Примеры сгенерированных проектов</CardTitle>
                <CardDescription>Изучите что можно создать с помощью генератора</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-lg mb-2">Игра-арканоид</h3>
                    <p className="mb-3 text-gray-600">Классическая игра с управлением мышью</p>
                    <div className="aspect-video bg-gray-200 rounded mb-3 flex items-center justify-center">
                      <p className="text-sm text-gray-500">Превью проекта</p>
                    </div>
                    <Button variant="outline" className="w-full">Открыть пример</Button>
                  </div>
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-lg mb-2">Анимированная история</h3>
                    <p className="mb-3 text-gray-600">Интерактивный рассказ с персонажами</p>
                    <div className="aspect-video bg-gray-200 rounded mb-3 flex items-center justify-center">
                      <p className="text-sm text-gray-500">Превью проекта</p>
                    </div>
                    <Button variant="outline" className="w-full">Открыть пример</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
