aaa = """
   ██████████████████████████████████████████████
      █                                   █     █
████  ███████  █  ████  ███████  ████  █  ████  █
█        █  █  █  █        █        █  █  █  █  █
█  █  ████  ████  ████  ████  █████████████  █  █
█  █        █     █  █  █              █        █
███████  ████  ████  █  ███████  █  ████  █  █  █
█           █     █  █     █  █  █  █     █  █  █
█  █████████████  █  █  ████  ███████  ███████  █
█        █     █     █                    █     █
█  ██████████  ████  ██████████  █  ███████  ████
█           █  █  █  █  █  █     █        █     █
█  █  █  █  █  █  █  █  █  █  ██████████  ███████
█  █  █  █  █           █        █        █     █
█  ███████  █  █  █  ███████  ██████████  ████  █
█  █     █     █  █  █           █              █
█  █  █  ████  ███████  █  ████  █  █  ███████  █
█  █  █           █     █     █  █  █        █  █
████  ████  ████  █████████████  ████  ███████  █
█        █     █     █  █  █  █  █  █  █  █     █
███████  █  ████  ████  █  █  █  █  ████  █  ████
█  █  █  █     █  █        █     █        █     █
█  █  █  ██████████  ██████████  █  ██████████  █
█        █              █  █           █  █     █
█  █  █  ████  ███████  █  █  █  ███████  █  ████
█  █  █        █  █  █     █  █  █     █        █
█  ████  ████  █  █  ████  ███████  ███████  ████
█     █     █  █                    █     █     █
█  ████  ████  ████  ███████████████████  ████  █
█  █        █     █        █  █     █     █     █
█  ████  ██████████  █  █  █  █  ████  █  ███████
█     █        █     █  █              █        
██████████████████████████████████████████████  
"""

for line in aaa.split('\n'):
    for i,c in enumerate(line):
        if i%2==0:
            continue
        if c:
            print('1,',end='')
        else:
            print('0,',end='')
    print()
