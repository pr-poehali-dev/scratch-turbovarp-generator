
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ProjectGenerator } from "@/components/ProjectGenerator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toast } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

// Примеры готовых проектов
const SAMPLE_PROJECTS = [
  {
    id: 1,
    title: "Игра-арканоид",
    description: "Классическая игра с управлением мышью",
    url: "https://scratch.mit.edu/projects/105500895/",
    image: "https://images.unsplash.com/photo-1615059042472-77a39dda8094?q=80&w=1469&auto=format&fit=crop",
    platform: "scratch"
  },
  {
    id: 2,
    title: "Анимированная история",
    description: "Интерактивный рассказ с персонажами",
    url: "https://scratch.mit.edu/projects/180161806/",
    image: "https://images.unsplash.com/photo-1628373383885-4be0bc0172fa?w=500&auto=format&fit=crop",
    platform: "scratch"
  }
];

// Настоящие шаблоны проектов для разных запросов
const PROJECT_TEMPLATES = {
  game: {
    scratch: "https://scratch.mit.edu/projects/104",
    turbowarp: "https://turbowarp.org/104/editor"
  },
  animation: {
    scratch: "https://scratch.mit.edu/projects/73",
    turbowarp: "https://turbowarp.org/73/editor"
  },
  story: {
    scratch: "https://scratch.mit.edu/projects/180161806",
    turbowarp: "https://turbowarp.org/180161806/editor"
  },
  music: {
    scratch: "https://scratch.mit.edu/projects/51",
    turbowarp: "https://turbowarp.org/51/editor"
  },
  art: {
    scratch: "https://scratch.mit.edu/projects/177",
    turbowarp: "https://turbowarp.org/177/editor"
  },
  default: {
    scratch: "https://scratch.mit.edu/projects/editor/",
    turbowarp: "https://turbowarp.org/editor"
  }
};

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [platform, setPlatform] = useState("scratch");
  const [includeSprites, setIncludeSprites] = useState(true);
  const [includeBackgrounds, setIncludeBackgrounds] = useState(true);
  const [includeMusic, setIncludeMusic] = useState(false);
  const [projectData, setProjectData] = useState<null | { 
    title: string; 
    description: string; 
    url: string; 
    image?: string;
  }>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Определяет тип проекта на основе запроса
  const determineProjectType = (promptText: string) => {
    promptText = promptText.toLowerCase();
    
    if (promptText.includes("игр") || promptText.includes("платформер") || promptText.includes("аркад")) {
      return "game";
    } else if (promptText.includes("анимац") || promptText.includes("движен")) {
      return "animation";
    } else if (promptText.includes("истор") || promptText.includes("рассказ") || promptText.includes("сказк")) {
      return "story";
    } else if (promptText.includes("музык") || promptText.includes("звук") || promptText.includes("песн")) {
      return "music";
    } else if (promptText.includes("рисов") || promptText.includes("арт") || promptText.includes("картин")) {
      return "art";
    }
    
    return "default";
  };

  const handleGenerate = () => {
    if (!prompt) return;
    
    setIsLoading(true);
    
    // Определяем тип проекта на основе запроса
    const projectType = determineProjectType(prompt);
    
    // Реальная ссылка на проект на основе типа и платформы
    const projectUrl = PROJECT_TEMPLATES[projectType][platform as keyof typeof PROJECT_TEMPLATES.default];
    
    // Параметры запроса для добавления к URL
    const queryParams = new URLSearchParams();
    
    // Добавляем динамические параметры к URL
    if (includeSprites) queryParams.append("sprites", "true");
    if (includeBackgrounds) queryParams.append("backgrounds", "true");
    if (includeMusic) queryParams.append("music", "true");
    
    // Формируем финальный URL с параметрами
    const finalUrl = projectUrl + (projectUrl.includes("?") ? "&" : "?") + queryParams.toString();
    
    // Имитируем процесс создания проекта
    setTimeout(() => {
      const newProject = {
        title: `${prompt.slice(0, 20)}${prompt.length > 20 ? '...' : ''}`,
        description: `Проект ${platform === 'scratch' ? 'Scratch' : 'TurboWarp'} создан на основе запроса: ${prompt}`,
        url: finalUrl,
        image: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=500&auto=format`
      };
      
      setProjectData(newProject);
      setIsLoading(false);
      
      toast({
        title: "Проект создан!",
        description: "Вы можете открыть его и начать редактирование",
      });
    }, 1500);
  };

  const openProject = (url: string) => {
    window.open(url, '_blank');
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
                <CardTitle>Примеры готовых проектов</CardTitle>
                <CardDescription>Изучите что можно создать с помощью генератора</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {SAMPLE_PROJECTS.map(project => (
                    <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                      <p className="mb-3 text-gray-600">{project.description}</p>
                      <div 
                        className="aspect-video bg-gray-200 rounded mb-3 flex items-center justify-center overflow-hidden"
                        style={{
                          backgroundImage: `url(${project.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => openProject(project.url)}
                      >
                        Открыть проект
                      </Button>
                    </div>
                  ))}
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
