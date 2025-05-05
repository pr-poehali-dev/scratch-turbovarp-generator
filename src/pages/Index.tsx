
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ProjectGenerator } from "@/components/ProjectGenerator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

// Реальные ссылки на проекты
const PROJECT_URLS = {
  scratch: {
    game: "https://scratch.mit.edu/projects/editor/?tutorial=getStarted",
    animation: "https://scratch.mit.edu/projects/editor/?tutorial=animate-a-name",
    story: "https://scratch.mit.edu/projects/editor/?tutorial=create-a-story",
    default: "https://scratch.mit.edu/projects/editor/"
  },
  turbowarp: {
    game: "https://turbowarp.org/editor?tutorial=getStarted",
    animation: "https://turbowarp.org/editor?tutorial=animate-a-name",
    story: "https://turbowarp.org/editor?tutorial=create-a-story",
    default: "https://turbowarp.org/editor"
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
  const [isSuccess, setIsSuccess] = useState(false);

  // Определяет тип проекта на основе запроса
  const determineProjectType = (promptText: string) => {
    promptText = promptText.toLowerCase();
    
    if (promptText.includes("игр") || promptText.includes("платформер") || promptText.includes("аркад")) {
      return "game";
    } else if (promptText.includes("анимац") || promptText.includes("движен")) {
      return "animation";
    } else if (promptText.includes("истор") || promptText.includes("рассказ") || promptText.includes("сказк")) {
      return "story";
    }
    
    return "default";
  };

  const handleGenerate = () => {
    if (!prompt) return;
    
    setIsLoading(true);
    
    // Определяем тип проекта на основе запроса
    const projectType = determineProjectType(prompt);
    
    // Получаем URL для конкретного типа проекта и платформы
    const projectUrl = PROJECT_URLS[platform as keyof typeof PROJECT_URLS][
      projectType as keyof typeof PROJECT_URLS.scratch
    ];
    
    // Имитация создания проекта с небольшой задержкой
    setTimeout(() => {
      // Создаем новый проект
      const newProject = {
        title: `${prompt.slice(0, 20)}${prompt.length > 20 ? '...' : ''}`,
        description: `Проект ${platform === 'scratch' ? 'Scratch' : 'TurboWarp'} создан на основе запроса: ${prompt}. Включает ${includeSprites ? 'спрайты, ' : ''}${includeBackgrounds ? 'фоны, ' : ''}${includeMusic ? 'музыку' : ''}`,
        url: projectUrl,
        image: platform === 'scratch' 
          ? "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=500&auto=format&fit=crop" 
          : "https://images.unsplash.com/photo-1536148935331-408321065b18?w=500&auto=format&fit=crop"
      };
      
      setProjectData(newProject);
      setIsLoading(false);
      setIsSuccess(true);
      
      // Показываем уведомление об успешном создании проекта
      setTimeout(() => {
        alert("Проект успешно создан! Теперь вы можете открыть его и начать работу.");
      }, 300);
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

        {isSuccess && (
          <div className="mb-4 p-4 bg-green-100 border border-green-200 rounded-md text-green-800">
            Проект успешно создан! Вы можете открыть его и начать работу.
          </div>
        )}

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
